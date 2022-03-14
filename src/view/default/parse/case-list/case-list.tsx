import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import { StateTree } from '@/type/model';
import { ParseCaseState } from '@/model/default/parse-case';
import CaseInfo from '@/schema/case-info';
import { helper } from '@/utils/helper';
import { getCaseColumns } from './column';
import { CaseListProp } from './prop';

const CaseList: FC<CaseListProp> = () => {

    const dispatch = useDispatch();
    const {
        loading,
        data,
        pageIndex,
        pageSize,
        total
    } = useSelector<StateTree, ParseCaseState>(state => state.parseCase);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    /**
     * 案件查询
     * @param condition 条件
     * @param pageIndex 页码
     */
    const query = (condition: Record<string, any>, pageIndex: number) => {
        dispatch({
            type: 'parseCase/queryCase',
            payload: { pageIndex, pageSize: 5, condition }
        });
    };

    useEffect(() => {
        query({}, 1);
    }, []);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
    const onPageChange = (pageIndex: number) => {
        query({}, pageIndex);
    }

    /**
     * 表格行Click
     */
    const onRowClick = ({ _id }: CaseInfo) => {
        setSelectedRowKeys([_id!]);
        dispatch({ type: 'parseDev/setCaseId', payload: _id });
    };

    /**
     * 行选择Change
     */
    const onRowSelectChange = (selectedRowKeys: Key[], selectedRows: CaseInfo[]) =>
        setSelectedRowKeys(selectedRowKeys);

    return <Table<CaseInfo>
        columns={getCaseColumns(dispatch)}
        dataSource={data}
        loading={loading}
        pagination={{
            current: pageIndex,
            pageSize,
            total,
            onChange: onPageChange
        }}
        rowSelection={{
            type: 'radio',
            onChange: onRowSelectChange,
            selectedRowKeys
        }}
        onRow={(record) => ({
            onClick: () => onRowClick(record)
        })}
        locale={{
            emptyText: <Empty
                description="暂无案件数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
        rowKey="_id"
        size="small"
        style={{ width: '400px' }} />;
};

export { CaseList };