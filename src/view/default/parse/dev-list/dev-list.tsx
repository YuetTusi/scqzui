import { join } from 'path';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, useLocation } from 'dva';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import message from 'antd/lib/message';
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
import { getDevColumns } from './column';
import { DevListProp } from './prop';


/**
 * 设备表格
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
    // const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const [editDevModalVisbile, setEditDevModalVisible] = useState<boolean>(false);
    const [exportReportModalVisible, setExportReportModalVisible] = useState<boolean>(false);
    const [exportBcpModalVisible, setExportBcpModalVisible] = useState<boolean>(false);

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
        return () => {
            dispatch({ type: 'parseDev/setCaseId', payload: undefined });
            dispatch({ type: 'parseDev/setExpandedRowKeys', payload: [] });
        }
    }, []);

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
                currentDev.current = data;
                setEditDevModalVisible(true);
                break;
            case ClickType.GenerateBCP:
                dispatch({ type: 'parseDev/gotoBcp', payload: { caseId, deviceId: data._id } });
                break;
            case ClickType.ExportBCP:
                dispatch({ type: 'exportBcpModal/setIsBatch', payload: false });
                dispatch({ type: 'exportBcpModal/setExportBcpDevice', payload: data });
                setExportBcpModalVisible(true);
                break;
            case ClickType.CloudSearch:
                dispatch({ type: 'parseDev/gotoTrail', payload: { caseId, deviceId: data._id } });
                break;
            default:
                console.warn('未知Click类型:', fn);
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
                message.info('无报告数据，请解析完成后生成报告');
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
            locale={{
                emptyText: <Empty
                    description="暂无设备数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
    </>;
};

export { DevList };