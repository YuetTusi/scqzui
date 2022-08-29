import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useLocation, useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { ParseCaseState } from '@/model/default/parse-case';
import { OperateDoingState } from '@/model/default/operate-doing';
import CaseInfo from '@/schema/case-info';
import { helper } from '@/utils/helper';
import BatchExportReportModal from '../batch-export-report-modal';
import ExportBcpModal from '../export-bcp-modal';
import { getCaseColumns } from './column';
import { CaseListProp } from './prop';

const { caseText } = helper.readConf()!;

/**
 * 案件表格
 * +---+
 * |   |
 * +---+
 * |#| |
 * +---+
 */
const CaseList: FC<CaseListProp> = () => {

    const dispatch = useDispatch();
    const { search } = useLocation();
    const {
        loading,
        data,
        pageIndex,
        pageSize,
        total,
        selectedRowKeys
    } = useSelector<StateTree, ParseCaseState>(state => state.parseCase);
    const operateDoing = useSelector<StateTree, OperateDoingState>(state =>
        state.operateDoing
    );
    // const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [batchExportReportModalVisible, setBatchExportReportModalVisible] = useState<boolean>(false);
    const [exportBcpModalVisible, setExportBcpModalVisible] = useState<boolean>(false);

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
        //如果有问号参数，则是从BCP页面返回
        const params = new URLSearchParams(search);
        const cid = params.get('cid');
        const casePageIndex = params.get('cp');
        if (cid) {
            query({}, Number.parseInt(casePageIndex!));
            dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [cid] });
            // setSelectedRowKeys([cid]);
            dispatch({ type: 'parseDev/setCaseId', payload: cid });
        } else {
            query({}, 1);
        }
    }, []);

    useEffect(() => {
        return () => {
            //退出清理选中行
            dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [] });
        }
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
        dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [_id] });
        dispatch({ type: 'parseDev/setCaseId', payload: _id });
    };

    /**
     * 行选择Change
     */
    const onRowSelectChange = (selectedRowKeys: Key[]) =>
        dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [selectedRowKeys] });


    /**
     * 导出BCP handle
     * @param bcpList BCP文件列表
     * @param destination 导出目录
     */
    const exportBcpHandle = async (bcpList: string[], destination: string) => {
        dispatch({ type: 'exportBcpModal/setExporting', payload: true });
        try {
            await helper.copyFiles(bcpList, destination);
            message.success('BCP导出成功');
        } catch (error) {
            message.error(`导出失败 ${error.message}`);
        } finally {
            dispatch({ type: 'exportBcpModal/setExporting', payload: false });
            setExportBcpModalVisible(false);
        }
    };

    return <>
        <Table<CaseInfo>
            columns={getCaseColumns(dispatch, operateDoing, setBatchExportReportModalVisible, setExportBcpModalVisible)}
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
                    description={`暂无${caseText ?? '案件'}数据`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }}
            rowKey="_id"
            size="small"
            style={{ width: '400px' }} />
        <BatchExportReportModal
            visible={batchExportReportModalVisible}
            cancelHandle={() => {
                dispatch({ type: 'batchExportReportModal/setDevices', payload: [] });
                setBatchExportReportModalVisible(false);
            }} />
        <ExportBcpModal
            visible={exportBcpModalVisible}
            okHandle={exportBcpHandle}
            cancelHandle={() => setExportBcpModalVisible(false)} />
    </>;
};

export { CaseList };