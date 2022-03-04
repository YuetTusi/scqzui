import React, { FC, useEffect, useState } from 'react';
import { routerRedux, useDispatch, useLocation, useSelector } from 'dva';
// import ImportOutlined from '@ant-design/icons/ImportOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import SubLayout from '@/component/sub-layout/sub-layout';
import { CaseInfo } from '@/schema/case-info';
import { StateTree } from '@/type/model';
import { CaseDataState } from '@/model/default/case-data';
import { getCaseColumns } from './column';
import { CaseDataBox } from './styled/style';
import DeviceTable from './device-table';

const CaseData: FC<{}> = ({ }) => {

    const dispatch = useDispatch();
    const { search } = useLocation();
    const {
        loading, current, pageSize, total, caseData
    } = useSelector<StateTree, CaseDataState>(state => state.caseData);
    const [expendRowKeys, setExpendRowKeys] = useState<Key[]>([]);

    useEffect(() => {
        setTimeout(() => {
            dispatch({ type: 'caseData/fetchCaseData', payload: { current: 1 } });
        });
    }, []);

    /**
    * 翻页Change
    */
    const onChange = (current: number, pageSize?: number) =>
        dispatch({
            type: 'caseData/fetchCaseData',
            payload: {
                current,
                pageSize
            }
        });

    /**
     * 渲染子表格
     */
    const renderSubTable = ({ _id }: CaseInfo) => <DeviceTable caseId={_id!} />;

    return <SubLayout title="案件管理">
        <CaseDataBox>
            <div className="case-content">
                <Table<CaseInfo>
                    columns={getCaseColumns(dispatch)}
                    expandedRowRender={renderSubTable}
                    dataSource={caseData}
                    rowKey={(record: CaseInfo) => record.m_strCaseName}
                    expandRowByClick={true}
                    expandedRowKeys={expendRowKeys}
                    onExpandedRowsChange={(rowKeys) => setExpendRowKeys(rowKeys)}
                    pagination={{
                        total,
                        current,
                        pageSize,
                        onChange
                    }}
                    locale={{ emptyText: <Empty description="无案件数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                    loading={loading}
                    bordered={true}
                />
            </div>
            <div className="fix-buttons">
                <span>
                    {/* <Button
                    onClick={() => this.selectCaseOrDeviceHandle(true)}
                    type="primary"
                    icon="import">
                    <ImportOutlined />
                    <span>导入案件</span>
                </Button>
                <Button
                    onClick={() => this.selectCaseOrDeviceHandle(false)}
                    style={{ display: this.state.isAdmin ? 'inline-block' : 'none' }}
                    type="primary"
                    icon="import">
                    导入检材
                </Button> */}
                    <Button
                        type="primary"
                        onClick={() => dispatch(routerRedux.push('/case-data/add'))}>
                        <PlusCircleOutlined />
                        <span>创建新案件</span>
                    </Button>
                </span>
            </div>
        </CaseDataBox>
    </SubLayout>
}

export default CaseData;