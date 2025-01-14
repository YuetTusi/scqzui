import React, { FC } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { FetchLog } from '@/schema/fetch-log';
import { getColumns } from './column';
import { QuickLogTableState } from '@/model/default/quick-log-table';
// import { FormValue } from '../prop';

const { fetchText } = helper.readConf()!;

/**
 * 采集日志
 */
const LogTable: FC<{}> = ({ }) => {

    const dispatch = useDispatch();
    const {
        loading,
        current,
        pageSize,
        total,
        data
    } = useSelector<StateTree, QuickLogTableState>(state => state.quickLogTable);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize?: number) => {
        dispatch({
            type: 'quickLogTable/query', payload: {
                condition: {},
                current: pageIndex,
                pageSize
            }
        });
    };

    return <>
        <Table<FetchLog>
            columns={getColumns()}
            loading={loading}
            dataSource={data}
            pagination={{
                current,
                pageSize,
                total,
                onChange: onPageChange
            }}
            rowKey="_id" />
    </>;
}

export default LogTable;