import React, { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { OperateDoingState } from '@/model/default/operate-doing';
import { QuickRecordListState } from '@/model/default/quick-record-list';
import { QuickRecord } from '@/schema/quick-record';
import { getColumns } from './column';
import { RecordListProp } from './prop';
import RecordInfo from '../record-info';
import { ClickType } from '../record-info/prop';
import EditEventRecModal from '../edit-event-rec-modal';

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

    useEffect(() => {
        query({ eventId }, pageIndex, 5);
    }, [eventId]);


    useEffect(() => {
        return () => {
            dispatch({ type: 'quickRecordList/setEventId', payload: undefined });
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
            case ClickType.Edit:
                currentRec.current = data;
                setEditRecModalVisbile(true);
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
            columns={getColumns(dispatch, operateDoing, () => { })}
            rowKey="_id"
            size="small"
            dataSource={data}
            loading={loading} />
        <EditEventRecModal
            onSaveHandle={onEditRecSave}
            onCancelHandle={() => setEditRecModalVisbile(false)}
            visible={editRecModalVisbile}
            data={currentRec.current} />
    </>
};

export default RecordList;