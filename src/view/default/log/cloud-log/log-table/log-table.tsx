import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { CloudLog } from '@/schema/cloud-log';
import { CloudLogTableState } from '@/model/default/cloud-log-table';
import { getColumns } from './column';
import { LogTableProp } from './prop';


/**
 * 云取日志表格
 */
const LogTable: FC<LogTableProp> = ({ formRef }) => {

    const dispatch = useDispatch();
    const {
        loading,
        current,
        pageSize,
        total,
        data
    } = useSelector<StateTree, CloudLogTableState>(state => state.cloudLogTable);
    const { getFieldsValue } = formRef;

    useEffect(() => {
        query({}, 1);
    }, []);

    /**
     * 查询
     * @param condition 条件
     * @param pageIndex 当页页
     * @param pageSize 页尺寸
     */
    const query = (condition: Record<string, any>, pageIndex: number, pageSize: number = helper.PAGE_SIZE) => {
        dispatch({
            type: 'cloudLogTable/query', payload: {
                condition,
                current: pageIndex,
                pageSize
            }
        });
    };

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize: number = helper.PAGE_SIZE) => {
        const values = getFieldsValue();
        query(values, pageIndex, pageSize);
    };

    return <Table<CloudLog>
        columns={getColumns(dispatch)}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={
            {
                onChange: onPageChange,
                current,
                pageSize,
                total
            }
        } />
};

export { LogTable }