import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { QuickEventListState } from '@/model/default/quick-event-list';
import { QuickEvent } from '@/schema/quick-event';
import { CaseListBox } from './styled/style';
import { getColumns } from './column';
import { EventListProp } from './prop';

/**
 * 快速点验案件表格
 */
const QuickEventList: FC<EventListProp> = ({ detailHandle }) => {

    const dispatch = useDispatch();
    const {
        data,
        total,
        pageIndex,
        pageSize,
        loading,
        selectedRowKeys
    } = useSelector<StateTree, QuickEventListState>(state => state.quickEventList);

    useEffect(() => {
        query(1, helper.PAGE_SIZE);
    }, []);

    useEffect(() => {
        return () => {
            //退出清理选中行
            dispatch({ type: 'quickEventList/setSelectedRowKeys', payload: [] });
        }
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
     * 行Click
     * @param id id
     */
    const onRowClick = (id: string) => {
        dispatch({ type: 'quickRecordList/setEventId', payload: id });
        dispatch({ type: 'quickEventList/setSelectedRowKeys', payload: [id] });
    };

    return <CaseListBox>
        <Table<QuickEvent>
            pagination={
                {
                    onChange: onPageChange,
                    current: pageIndex,
                    pageSize,
                    total,
                }
            }
            columns={getColumns(dispatch, detailHandle)}
            onRow={({ _id }) => ({
                onClick: () => onRowClick(_id!)
            })}
            rowSelection={{
                type: 'radio',
                selectedRowKeys,
                onChange: (k: Key[]) => onRowClick(k[0] as string)
            }}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            size="small"
        />
    </CaseListBox>
};

export default QuickEventList;