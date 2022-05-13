import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { FormInstance } from 'antd/es/form/Form';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { FetchLogTableState } from '@/model/default/fetch-log-table';
import { FetchLog } from '@/schema/fetch-log';
import { FetchRecord } from '@/schema/fetch-record';
import { HistoryModal } from '@/component/dialog/fetch-record-modal';
import { getColumns } from './column';
import { FormValue } from '../prop';

const { fetchText } = helper.readConf()!;

/**
 * 采集日志
 */
const LogTable: FC<{ formRef: FormInstance<FormValue> }> = ({ formRef }) => {

    const dispatch = useDispatch();
    const currentRecord = useRef<FetchRecord[]>([]);
    const [historyModalVisible, setHistoryModalVisible] = useState<boolean>(false);
    const {
        loading,
        current,
        pageSize,
        total,
        data
    } = useSelector<StateTree, FetchLogTableState>(state => state.fetchLogTable);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize?: number) => {
        dispatch({
            type: 'fetchLogTable/queryAllFetchLog', payload: {
                condition: {},
                current: pageIndex,
                pageSize
            }
        });
    };

    /**
     * 显示采集记录handle
     */
    const showHistoryHandle = ({ record }: FetchLog) => {
        currentRecord.current = record ?? [];
        setHistoryModalVisible(true);
    };

    return <>
        <Table<FetchLog>
            columns={getColumns(showHistoryHandle)}
            loading={loading}
            dataSource={data}
            pagination={{
                current,
                pageSize,
                total,
                onChange: onPageChange
            }}
            rowKey="_id" />
        <HistoryModal
            visible={historyModalVisible}
            data={currentRecord.current}
            cancelHandle={() => setHistoryModalVisible(false)}
            title={`${fetchText ?? '取证'}记录`} />
    </>;
}

export default LogTable;