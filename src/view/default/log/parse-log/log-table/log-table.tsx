import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Table from 'antd/lib/table';
import { FormInstance } from 'antd/es/form/Form';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { FetchLog } from '@/schema/fetch-log';
import { FetchRecord } from '@/schema/fetch-record';
import { HistoryModal } from '@/component/dialog/fetch-record-modal';
import { getColumns } from './column';
import { FormValue } from '../prop';
import ParseLog from '@/schema/parse-log';
import { ParseLogTableState } from '@/model/default/parse-log-table';
import { AppTable } from './app-table';

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
    } = useSelector<StateTree, ParseLogTableState>(state => state.parseLogTable);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize?: number) => {
        dispatch({
            type: 'parseLogTable/queryParseLog', payload: {
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
        <Table<ParseLog>
            columns={getColumns(dispatch)}
            loading={loading}
            dataSource={data}
            expandRowByClick={true}
            expandedRowRender={({ apps }) => <AppTable data={apps ?? []} />}
            pagination={{
                current,
                pageSize,
                total,
                onChange: onPageChange,
                showSizeChanger: false
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