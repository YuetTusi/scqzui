import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import { StateTree } from '@/type/model';
import { ParseCaseState } from '@/model/default/parse-case';
import CaseInfo from '@/schema/case-info';
import { helper } from '@/utils/helper';
import { getDevColumns } from './column';
import { DevListProp } from './prop';
import { ParseDevState } from '@/model/default/parse-dev';
import DeviceType from '@/schema/device-type';
import DevInfo from '../dev-info';

/**
 * 设备列表
 */
const DevList: FC<DevListProp> = ({ }) => {

    const dispatch = useDispatch();
    const {
        caseId,
        data,
        loading,
        pageIndex,
        pageSize,
        total
    } = useSelector<StateTree, ParseDevState>(state => state.parseDev);
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

    /**
     * 查询案件下设备
     * @param condition 条件
     * @param pageIndex 当前页
     */
    const query = (condition: Record<string, any>, pageIndex: number) => {
        dispatch({
            type: 'parseDev/queryDev', payload: {
                condition,
                pageIndex,
                pageSize: 5
            }
        });
    }

    useEffect(() => {
        query({}, 1);
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
    const onExpand = (expanded: boolean, { _id }: DeviceType) => {
        if (expanded) {
            setExpandedRowKeys([_id!]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    return <Table<DeviceType>
        columns={getDevColumns(dispatch)}
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
            expandedRowRender: (record) => <DevInfo data={record} />,
            expandedRowKeys: expandedRowKeys,
            onExpand,
            expandRowByClick: true
        }}
        rowKey="_id"
        size="small"
    />;
};

export { DevList };