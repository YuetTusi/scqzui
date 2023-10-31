import debounce from 'lodash/debounce';
import iconv from 'iconv-lite';
import { basename, join } from 'path';
import { spawn } from 'child_process';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { routerRedux, useDispatch, useSelector } from 'dva';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import { Key } from 'antd/lib/table/interface';
import SubLayout from '@/component/sub-layout/sub-layout';
import { Split } from '@/component/style-tool';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import { CaseInfo } from '@/schema/case-info';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { CaseDataState } from '@/model/default/case-data';
import DeviceTable from './device-table';
import { getCaseColumns } from './column';
import { CaseDataBox } from './styled/style';
import {
    importDevice, readCaseJson, readDirOnly, getCaseByName
} from './util';
import { ColumnAction } from './prop';

let archiveProc: any = null;
const { caseText } = helper.readConf()!;
const { Group } = Button;

const CaseData: FC<{}> = ({ }) => {

    const dispatch = useDispatch();
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
            content: `正在导入${caseText ?? '案件'}及检材，请稍后...`,
            okText: '确定',
            maskClosable: false,
            centered: true,
            okButtonProps: { disabled: true }
        });

        try {
            const caseJson = await readCaseJson(caseJsonPath);
            if (helper.isNullOrUndefinedOrEmptyString(caseJson.caseName)) {
                throw new Error(`无法读取${caseText ?? '案件'}数据，请选择Case.json文件`);
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
                content: `${caseText ?? '案件'}导入成功`,
                okButtonProps: { disabled: false }
            });
        } catch (error) {
            modal.update({
                title: `${caseText ?? '案件'}导入失败`,
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
            centered: true,
            okButtonProps: { disabled: true }
        });
        const caseJsonPath = join(deviceJsonPath, '../../../Case.json');
        const casePath = join(deviceJsonPath, '../../../../');
        try {
            const caseJson = await readCaseJson(caseJsonPath);
            if (helper.isNullOrUndefinedOrEmptyString(caseJson.caseName)) {
                throw new Error(`导入检材失败，无法读取${caseText ?? '案件'}数据`);
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
     * 解压缩数据
     */
    const uncompressData = async () => {
        const archiveAt = join(helper.APP_CWD, '../tools/archive');
        const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
            title: '请选择检材数据',
            properties: ['openFile']
        });
        if (helper.isNullOrUndefined(filePaths) || filePaths.length < 1) {
            return;
        }
        const dst = join(filePaths[0], '../');
        console.log(join(archiveAt, 'archive_tool.exe'));
        console.log([
            '--src',
            filePaths[0],
            '--dst',
            dst,
            '--op',
            'decompress'
        ]);
        archiveProc = spawn('archive_tool.exe', [
            '--src',
            filePaths[0],
            '--dst',
            dst,
            '--op',
            'decompress'
        ], {
            cwd: archiveAt
        });

        if (archiveProc !== null) {
            const mid = helper.newId()
            const msg = new AlartMessageInfo({
                id: mid,
                msg: '正在解压检材数据，请等待'
            });
            dispatch({
                type: 'alartMessage/addAlertMessage',
                payload: msg
            });
            archiveProc.once('exit', async (code: number) => {
                if (code === 0) {
                    dispatch({
                        type: 'alartMessage/removeAlertMessage',
                        payload: mid
                    });

                    await startImportCase(join(dst, basename(filePaths[0], '.zip'), 'Case.json'));
                } else {
                    dispatch({
                        type: 'alartMessage/removeAlertMessage',
                        payload: mid
                    });
                }
            });
            archiveProc.on('error', () => {
                notification.warn({
                    type: 'warning',
                    message: '导入失败',
                    description: `检材数据解压失败`,
                    duration: 0,
                });
                dispatch({
                    type: 'alartMessage/removeAlertMessage',
                    payload: mid
                });
            });
        }
    };

    /**
     * 压缩数据
     */
    const compressData = async (caseData: CaseInfo) => {
        const { m_strCasePath, m_strCaseName } = caseData;
        const archiveAt = join(helper.APP_CWD, '../tools/archive');
        const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
            title: '请选择检材目录',
            properties: ['openDirectory']
        });
        if (helper.isNullOrUndefined(filePaths) || filePaths.length < 1) {
            return;
        }
        const caseAt = join(m_strCasePath, m_strCaseName);
        console.log(join(archiveAt, 'archive_tool.exe'));
        console.log([
            '--src',
            caseAt,
            '--dst',
            filePaths[0],
            '--op',
            'compress'
        ]);
        archiveProc = spawn('archive_tool.exe', [
            '--src',
            caseAt,
            '--dst',
            filePaths[0],
            '--op',
            'compress'
        ], {
            cwd: archiveAt
        });

        if (archiveProc !== null) {
            const mid = helper.newId()
            const msg = new AlartMessageInfo({
                id: mid,
                msg: '正在压缩检材数据，请等待'
            });
            dispatch({
                type: 'alartMessage/addAlertMessage',
                payload: msg
            });
            archiveProc.once('exit', (code: any) => {
                if (code === 0) {
                    dispatch({
                        type: 'alartMessage/removeAlertMessage',
                        payload: mid
                    });
                    notification.success({
                        type: 'success',
                        message: '导出成功',
                        description: `检材「${m_strCaseName}」数据压缩成功，请拷贝数据`,
                        duration: 0,
                    });
                    shell.showItemInFolder(iconv.encode(join(filePaths[0], `${m_strCaseName}.zip`), 'ascii').toString('binary'));
                } else {
                    notification.warn({
                        type: 'warning',
                        message: '导出失败',
                        description: `检材「${m_strCaseName}」数据压缩失败`,
                        duration: 0,
                    });
                    dispatch({
                        type: 'alartMessage/removeAlertMessage',
                        payload: mid
                    });
                }
                archiveProc = null;
            });
            archiveProc.on('error', () => {
                notification.warn({
                    type: 'warning',
                    message: '导出失败',
                    description: `检材「${m_strCaseName}」数据压缩失败`,
                    duration: 0,
                });
                dispatch({
                    type: 'alartMessage/removeAlertMessage',
                    payload: mid
                });
                archiveProc = null;
            });
        }
    };

    const actionHandle = async (
        type: ColumnAction, data: CaseInfo) => {

        try {
            switch (type) {
                case ColumnAction.Import:
                    uncompressData();
                    break;
                case ColumnAction.Export:
                    compressData(data);
                    break;
            }
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 渲染子表格
     */
    const renderSubTable = ({ _id }: CaseInfo) => <DeviceTable caseId={_id!} />;

    return <SubLayout title={`${caseText ?? '案件'}管理`}>
        <CaseDataBox>
            <div className="case-content">
                <div className="search-bar">
                    <Group>
                        <Button
                            onClick={() => uncompressData()}
                            type="primary">
                            <ImportOutlined />
                            <span>{`导入压缩${caseText ?? '案件'}`}</span>
                        </Button>
                        <Button
                            onClick={() => selectCaseOrDeviceHandle(true)}
                            type="primary">
                            <ImportOutlined />
                            <span>{`导入${caseText ?? '案件'}`}</span>
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
                        columns={getCaseColumns(dispatch, actionHandle)}
                        expandedRowRender={renderSubTable}
                        dataSource={caseData}
                        rowKey={(record: CaseInfo) => record._id!}
                        expandRowByClick={true}
                        expandedRowKeys={expendRowKeys}
                        onExpandedRowsChange={(rowKeys) => setExpendRowKeys(rowKeys)}
                        pagination={{
                            total,
                            current,
                            pageSize,
                            onChange
                        }}
                        locale={{ emptyText: <Empty description={`无${caseText ?? '案件'}数据`} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                        loading={loading}
                        bordered={true}
                    />
                </div>
            </div>
        </CaseDataBox>
    </SubLayout>
}

export default CaseData;