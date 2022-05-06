import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { OperateDoingState } from '@/model/default/operate-doing';
import { QuickRecordListState } from '@/model/default/quick-record-list';
import { QuickRecord } from '@/schema/quick-record';
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
        loading
    } = useSelector<StateTree, QuickRecordListState>(state => state.quickRecordList);

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
                pageSize: 5
            }
        });

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize?: number) => {
        query({ eventId }, pageIndex, 5);
    };

    return <Table<QuickRecord>
        pagination={{
            current: pageIndex,
            pageSize,
            total,
            onChange: onPageChange
        }}
        columns={getColumns(dispatch, operateDoing, () => { })}
        rowKey="_id"
        dataSource={data}
        loading={loading} />
};

export default RecordList;