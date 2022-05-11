import { join } from 'path';
import React, { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { OperateDoingState } from '@/model/default/operate-doing';
import { QuickRecordListState } from '@/model/default/quick-record-list';
import { QuickRecord } from '@/schema/quick-record';
import RecordInfo from '../record-info';
import { ClickType } from '../record-info/prop';
import EditEventRecModal from '../edit-event-rec-modal';
import ExportReportModal from '../export-report-modal';
import HitChartModal from '../hit-chart-modal';
import { getColumns } from './column';
import { RecordListProp } from './prop';

/**
 * 快速点验设备列表
 */
const RecordList: FC<RecordListProp> = () => {

    const dispatch = useDispatch();
    const operateDoing = useSelector<StateTree, OperateDoingState>(state => state.operateDoing);
    const {
        eventId,
        pageIndex,
        pageSize,
        data,
        total,
        loading,
        expandedRowKeys
    } = useSelector<StateTree, QuickRecordListState>(state => state.quickRecordList);
    const currentRec = useRef<QuickRecord>();
    const [editRecModalVisbile, setEditRecModalVisbile] = useState<boolean>(false);
    const [exportReportModalVisible, setExportReportModalVisible] = useState<boolean>(false);
    const [hitChartModalVisible, setHitChartModalVisible] = useState<boolean>(false);

    useEffect(() => {
        query({ eventId }, pageIndex, 5);
    }, [eventId]);


    useEffect(() => {
        return () => {
            dispatch({ type: 'quickRecordList/setEventId', payload: undefined });
            dispatch({ type: 'quickRecordList/setExpandedRowKeys', payload: [] });
        };
    }, []);

    /**
     * 查询
     */
    const query = (
        { eventId }: Record<string, any>,
        pageIndex: number,
        pageSize: number = helper.PAGE_SIZE) =>
        dispatch({
            type: 'quickRecordList/query', payload: {
                eventId,
                pageIndex,
                pageSize
            }
        });

    /**
    * 设备信息按钮点击统一处理
    * @param data 设备
    * @param fn 功能枚举
    */
    const onRecButtonClick = (data: QuickRecord, fn: ClickType) => {
        switch (fn) {
            case ClickType.Hit:
                currentRec.current = data;
                setHitChartModalVisible(true);
                break;
            case ClickType.Edit:
                currentRec.current = data;
                setEditRecModalVisbile(true);
                break;
            case ClickType.Delete:
                const [name] = data.mobileName!.split('_');
                Modal.confirm({
                    onOk() {
                        dispatch({ type: 'quickRecordList/delRec', payload: data });
                    },
                    title: '删除设备',
                    content: `确认删除「${name}」数据？`,
                    okText: '是',
                    cancelText: '否',
                    centered: true,
                    zIndex: 1031
                });
                break;
            default:
                console.warn('未知Click类型:', fn);
                break;
        }
    };

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize?: number) => {
        query({ eventId }, pageIndex, 5);
    };

    /**
     * 展开行Change
     */
    const onExpand = (expanded: boolean, { _id }: QuickRecord) =>
        dispatch({ type: 'quickRecordList/setExpandedRowKeys', payload: expanded ? [_id] : [] });

    const onEditRecSave = (data: QuickRecord) => {
        dispatch({ type: 'quickRecordList/updateRec', payload: data });
        setEditRecModalVisbile(false);
    };

    /**
     * 导出报告Click
     */
    const exportReportClick = async (data: QuickRecord) => {
        const treeJsonPath = join(
            data.phonePath!,
            'report/public/data/tree.json'
        );
        try {
            let exist = await helper.existFile(treeJsonPath);
            if (exist) {
                currentRec.current = data;
                setExportReportModalVisible(true);
            } else {
                message.destroy();
                message.info('无报告数据，请解析完成后生成报告');
            }
        } catch (error) {
            message.warning('读取报告数据失败，请重新生成报告');
        }
    };

    return <>
        <Table<QuickRecord>
            pagination={{
                current: pageIndex,
                pageSize,
                total,
                onChange: onPageChange
            }}
            expandable={{
                expandedRowRender: (record) => <RecordInfo
                    data={record}
                    onButtonClick={onRecButtonClick} />,
                expandedRowKeys: expandedRowKeys,
                onExpand,
                expandRowByClick: true
            }}
            columns={getColumns(dispatch, operateDoing, exportReportClick)}
            rowKey="_id"
            size="small"
            dataSource={data}
            loading={loading} />
        <EditEventRecModal
            onSaveHandle={onEditRecSave}
            onCancelHandle={() => setEditRecModalVisbile(false)}
            visible={editRecModalVisbile}
            data={currentRec.current} />
        <ExportReportModal
            visible={exportReportModalVisible}
            data={currentRec.current}
            closeHandle={() => setExportReportModalVisible(false)}
        />
        <HitChartModal
            visible={hitChartModalVisible}
            record={currentRec.current!}
            exportHandle={() => setHitChartModalVisible(false)}
            closeHandle={() => setHitChartModalVisible(false)}
        />
    </>
};

export default RecordList;