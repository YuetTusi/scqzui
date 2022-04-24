import React, { FC, Key, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { QuickEventListState } from '@/model/default/quick-event-list';
import { QuickEvent } from '@/schema/quick-event';
import { getColumns } from './column';
import { EventListProp } from './prop';

/**
 * 快速点验案件表格
 */
const QuickEventList: FC<EventListProp> = ({ qrcodeHandle }) => {

    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
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

    /**
     * 行Change
     * @param keys 
     */
    const onRowSelectChange = (keys: Key[]) => {
        console.log(keys);
        setSelectedRowKeys(keys);
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
        columns={getColumns(dispatch, qrcodeHandle)}
        onRow={({ _id }) => ({
            onClick: () => setSelectedRowKeys([_id!])
        })}
        rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: onRowSelectChange,
        }}
        dataSource={data}
        loading={loading}
        rowKey="_id"
    />
};

export default QuickEventList;