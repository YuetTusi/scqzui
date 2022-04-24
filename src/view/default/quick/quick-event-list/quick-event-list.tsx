import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { EventListProp } from './prop';
import { StateTree } from '@/type/model';
import { QuickEventListState } from '@/model/default/quick-event-list';
import { QuickEvent } from '@/schema/quick-event';
import { getColumns } from './column';
import { helper } from '@/utils/helper';

/**
 * 快速点验案件表格
 */
const QuickEventList: FC<EventListProp> = () => {

    const dispatch = useDispatch();
    const {
        data,
        total,
        pageIndex,
        pageSize,
        loading
    } = useSelector<StateTree, QuickEventListState>(state => state.quickEventList);

    useEffect(() => {
        query(1, helper.PAGE_SIZE);
    }, []);

    const query = (pageIndex: number, pageSize: number) =>
        dispatch({
            type: 'quickEventList/query', payload: {
                pageIndex, pageSize
            }
        });

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize: number = helper.PAGE_SIZE) => {
        query(pageIndex, pageSize);
    };

    return <Table<QuickEvent>
        pagination={
            {
                onChange: onPageChange,
                current: pageIndex,
                pageSize,
                total,
            }
        }
        columns={getColumns(dispatch)}
        dataSource={data}
        loading={loading}
        rowKey="_id"
    />
};

export default QuickEventList;