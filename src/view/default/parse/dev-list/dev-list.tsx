import { join } from 'path';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, useLocation } from 'dva';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { useDestroy } from '@/hook';
import { StateTree } from '@/type/model';
import { DeviceType } from '@/schema/device-type';
import { ParseDevState } from '@/model/default/parse-dev';
import { OperateDoingState } from '@/model/default/operate-doing';
import { helper } from '@/utils/helper';
import DevInfo from '../dev-info';
import { ClickType } from '../dev-info/prop';
import EditDevModal from '../edit-dev-modal';
import ExportReportModal from '../export-report-modal';
import ExportBcpModal from '../export-bcp-modal';
import HitChartModal from '../hit-chart-modal';
import { getDevColumns } from './column';
import { DevListProp } from './prop';

const { parseText } = helper.readConf()!;

const runDiskExe = (data: DeviceType, appId: string) => {
    const doHide = message.loading('正在打开，请稍等...', 0);
    let handle: any = null;
    helper.runProc(handle, 'web_selenium.exe', join(helper.APP_CWD, '../yq'), [
        '-i',
        data.phonePath ?? '',
        '-a',
        appId
    ]);
    if (handle !== null) {
        handle.once('close', doHide());
    }
    setTimeout(() => {
        doHide();
        if (handle === null) {
            message.warn('打开失败')
        }
    }, 3000);
};

/**
 * 设备表格
 * +---+
 * |   |
 * +---+
 * | |#|
 * +---+
 */
const DevList: FC<DevListProp> = ({ }) => {

    const dispatch = useDispatch();
    const { search } = useLocation();
    const {
        caseId,
        data,
        loading,
        pageIndex,
        pageSize,
        total,
        expandedRowKeys
    } = useSelector<StateTree, ParseDevState>(state => state.parseDev);
    const operateDoing = useSelector<StateTree, OperateDoingState>(state => state.operateDoing);
    const currentDev = useRef<DeviceType>();
    const [editDevModalVisbile, setEditDevModalVisible] = useState<boolean>(false);
    const [exportReportModalVisible, setExportReportModalVisible] = useState<boolean>(false);
    const [exportBcpModalVisible, setExportBcpModalVisible] = useState<boolean>(false);
    const [hitChartModalVisible, setHitChartModalVisible] = useState<boolean>(false);

    useDestroy(() => {
        dispatch({ type: 'parseDev/setCaseId', payload: undefined });
        dispatch({ type: 'parseDev/setExpandedRowKeys', payload: [] });
    });

    /**
     * 查询案件下设备
     * @param condition 条件
     * @param pageIndex 当前页
     */
    const query = (condition: Record<string, any>, pageIndex: number) => {
        dispatch({
            type: 'parseDev/queryDev',
            payload: {
                condition,
                pageIndex,
                pageSize: 5
            }
        });
    }

    useEffect(() => {
        const params = new URLSearchParams(search);
        const dp = params.get('dp');
        query({}, dp === null ? 1 : Number.parseInt(dp));
    }, [caseId]);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
    const onPageChange = (pageIndex: number) =>
        query({}, pageIndex);

    /**
     * 展开行Change
     */
    const onExpand = (expanded: boolean, { _id }: DeviceType) =>
        dispatch({ type: 'parseDev/setExpandedRowKeys', payload: expanded ? [_id] : [] });

    /**
     * 设备信息按钮点击统一处理
     * @param data 设备
     * @param fn 功能枚举
     */
    const onDevButtonClick = (data: DeviceType, fn: ClickType) => {
        switch (fn) {
            case ClickType.Edit:
                //编辑
                currentDev.current = data;
                setEditDevModalVisible(true);
                break;
            case ClickType.Delete:
                //删除
                const [name] = data.mobileName!.split('_');
                Modal.confirm({
                    onOk() {
                        dispatch({ type: 'parseDev/delDev', payload: data });
                    },
                    title: '删除设备',
                    content: `确认删除「${name}」数据？`,
                    okText: '是',
                    cancelText: '否',
                    centered: true,
                    zIndex: 1031
                });
                break;
            case ClickType.GenerateBCP:
                //BCP生成
                dispatch({ type: 'parseDev/gotoBcp', payload: { caseId, deviceId: data._id } });
                break;
            case ClickType.ExportBCP:
                //BCP导出
                dispatch({ type: 'exportBcpModal/setIsBatch', payload: false });
                dispatch({ type: 'exportBcpModal/setExportBcpDevice', payload: data });
                setExportBcpModalVisible(true);
                break;
            case ClickType.CloudSearch:
                //云点验查询
                dispatch({ type: 'parseDev/gotoTrail', payload: { caseId, deviceId: data._id } });
                break;
            case ClickType.Hit:
                //命中统计
                currentDev.current = data;
                setHitChartModalVisible(true);
                break;
            case ClickType.BaiduDisk:
                runDiskExe(data, '1280015');
                break;
            case ClickType.WPSDisk:
                runDiskExe(data, '1280028');
                break;
            default:
                console.warn(`未知Click类型:${fn}`);
                break;
        }
    };

    /**
     * 编辑保存
     * @param data 设备
     */
    const onEditDevSave = (data: DeviceType) => {
        dispatch({ type: 'parseDev/updateDev', payload: data });
        setEditDevModalVisible(false);
    };

    /**
     * 导出报告Click
     */
    const exportReportClick = async (data: DeviceType) => {
        const treeJsonPath = join(
            data.phonePath!,
            'report/public/data/tree.json'
        );
        try {
            let exist = await helper.existFile(treeJsonPath);
            if (exist) {
                currentDev.current = data;
                setExportReportModalVisible(true);
            } else {
                message.destroy();
                message.info(`无报告数据，请${parseText ?? '解析'}完成后生成报告`);
            }
        } catch (error) {
            message.warning('读取报告数据失败，请重新生成报告');
        }
    };

    /**
    * 导出BCP handle
    * @param bcpList BCP文件列表
    * @param destination 导出目录
    */
    const exportBcpHandle = async (bcpList: string[], destination: string) => {
        dispatch({ type: 'exportBcpModal/setExporting', payload: true });
        try {
            await helper.copyFiles(bcpList, destination);
            message.success('BCP导出成功');
        } catch (error) {
            message.error(`导出失败 ${error.message}`);
        } finally {
            dispatch({ type: 'exportBcpModal/setExporting', payload: false });
            setExportBcpModalVisible(false);
        }
    };

    return <>
        <Table<DeviceType>
            columns={getDevColumns(dispatch, operateDoing, exportReportClick)}
            dataSource={data}
            loading={loading}
            pagination={{
                onChange: onPageChange,
                current: pageIndex,
                pageSize,
                total,
                showSizeChanger: false
            }}
            expandable={{
                expandedRowRender: (record) => <DevInfo
                    data={record}
                    onButtonClick={onDevButtonClick} />,
                expandedRowKeys: expandedRowKeys,
                onExpand,
                expandRowByClick: true
            }}
            rowKey="_id"
            size="small"
        />
        <EditDevModal
            onSaveHandle={onEditDevSave}
            onCancelHandle={() => setEditDevModalVisible(false)}
            visible={editDevModalVisbile}
            data={currentDev.current} />
        <ExportReportModal
            visible={exportReportModalVisible}
            data={currentDev.current}
            closeHandle={() => setExportReportModalVisible(false)}
        />
        <ExportBcpModal
            visible={exportBcpModalVisible}
            okHandle={exportBcpHandle}
            cancelHandle={() => setExportBcpModalVisible(false)}
        />
        <HitChartModal
            visible={hitChartModalVisible}
            record={currentDev.current!}
            exportHandle={() => setHitChartModalVisible(false)}
            closeHandle={() => setHitChartModalVisible(false)}
        />
    </>;
};

export { DevList };