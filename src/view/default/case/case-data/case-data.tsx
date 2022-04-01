import debounce from 'lodash/debounce';
import { join } from 'path';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { routerRedux, useDispatch, useLocation, useSelector } from 'dva';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
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
import { Split } from '@/component/style-tool';
import Modal from 'antd/lib/modal';
import { importDevice, readCaseJson, readDirOnly, getCaseByName } from './util';
import { helper } from '@/utils/helper';


const { Group } = Button;

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
         * 导入案件
         * @param caseJsonPath 案件Case.json路径
         */
    const startImportCase = async (caseJsonPath: string) => {
        const modal = Modal.info({
            content: '正在导入案件及检材，请稍后...',
            okText: '确定',
            maskClosable: false,
            okButtonProps: { disabled: true }
        });

        try {
            const caseJson = await readCaseJson(caseJsonPath);
            if (helper.isNullOrUndefinedOrEmptyString(caseJson.caseName)) {
                throw new Error('无法读取案件数据，请选择Case.json文件');
            }
            const casePath = join(caseJsonPath, '../../');
            const caseSavePath = join(caseJsonPath, '../');
            const caseData = await getCaseByName(caseJson, casePath);
            const holderDir = await readDirOnly(caseSavePath);
            const holderFullDir = holderDir.map((i) => join(caseSavePath, i));

            let allDeviceJsonPath: string[] = [];
            for (let i = 0; i < holderFullDir.length; i++) {
                const devicePath = await readDirOnly(holderFullDir[i]);

                for (let j = 0; j < devicePath.length; j++) {
                    allDeviceJsonPath = allDeviceJsonPath.concat([
                        join(holderFullDir[i], devicePath[j], 'Device.json')
                    ]);
                }
            }
            const importTasks = allDeviceJsonPath.map((i) => importDevice(i, caseData));
            await Promise.allSettled(importTasks);

            modal.update({
                content: '案件导入成功',
                okButtonProps: { disabled: false }
            });
        } catch (error) {
            modal.update({
                title: '案件导入失败',
                content: error.message,
                okButtonProps: { disabled: false }
            });
        } finally {
            dispatch({ type: 'caseData/fetchCaseData', payload: { current: 1 } });
            setTimeout(() => {
                modal.destroy();
            }, 3000);
        }
    };

    /**
    * 导入检材（设备）
    * @param deviceJsonPath 设备Device.json路径
    */
    const startImportDevice = async (deviceJsonPath: string) => {
        const modal = Modal.info({
            content: '正在导入检材，请稍后...',
            okText: '确定',
            maskClosable: false,
            okButtonProps: { disabled: true }
        });
        const caseJsonPath = join(deviceJsonPath, '../../../Case.json');
        const casePath = join(deviceJsonPath, '../../../../');
        try {
            const caseJson = await readCaseJson(caseJsonPath);
            if (helper.isNullOrUndefinedOrEmptyString(caseJson.caseName)) {
                throw new Error('导入检材失败，无法读取案件数据');
            }
            const caseData = await getCaseByName(caseJson, casePath);
            await importDevice(deviceJsonPath, caseData);
            modal.update({
                content: '检材导入成功',
                okButtonProps: { disabled: false }
            });
        } catch (error) {
            modal.update({
                title: '检材导入失败',
                content: error.message,
                okButtonProps: { disabled: false }
            });
        } finally {
            dispatch({ type: 'caseData/fetchCaseData', payload: { current: 1 } });
            setTimeout(() => {
                modal.destroy();
            }, 3000);
        }
    };

    /**
     * 案件/检材选择
     * @param {boolean} isCase 是否是案件
     */
    const selectCaseOrDeviceHandle = debounce(
        async (isCase: boolean) => {
            const dialogVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                title: isCase ? '请选择 Case.json 文件' : '请选择 Device.json 文件',
                properties: ['openFile'],
                filters: [
                    { name: isCase ? 'Case.json文件' : 'Device.json文件', extensions: ['json'] }
                ]
            });

            if (dialogVal.filePaths.length > 0) {
                isCase
                    ? startImportCase(dialogVal.filePaths[0])
                    : startImportDevice(dialogVal.filePaths[0]);
            }
        },
        400,
        { leading: true, trailing: false }
    );

    /**
     * 渲染子表格
     */
    const renderSubTable = ({ _id }: CaseInfo) => <DeviceTable caseId={_id!} />;

    return <SubLayout title="案件管理">
        <CaseDataBox>
            <div className="case-content">
                <div className="search-bar">
                    <Group>
                        <Button
                            onClick={() => selectCaseOrDeviceHandle(true)}
                            type="primary">
                            <ImportOutlined />
                            <span>导入案件</span>
                        </Button>
                        <Button
                            onClick={() => selectCaseOrDeviceHandle(false)}
                            type="primary">
                            <ImportOutlined />
                            <span>导入检材</span>
                        </Button>
                    </Group>
                    <Group>
                        <Button
                            type="primary"
                            onClick={() => dispatch(routerRedux.push('/case-data/add'))}>
                            <PlusCircleOutlined />
                            <span>添加</span>
                        </Button>
                    </Group>
                </div>
                <Split />
                <div className="table-panel">
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
            </div>
        </CaseDataBox>
    </SubLayout>
}

export default CaseData;