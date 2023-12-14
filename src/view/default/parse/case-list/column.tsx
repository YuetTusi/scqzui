import { join } from 'path';
import { execFile } from 'child_process';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import { ColumnsType, ColumnType } from "antd/lib/table";
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import { CaseInfo } from "@/schema/case-info";
import { TableName } from '@/schema/table-name';
import DeviceType from '@/schema/device-type';
import { OperateDoingState } from '@/model/default/operate-doing';
import { getDb } from '@/utils/db';
import { NoWrapText } from './styled/style';
import { ExtraAction } from '../prop';

const cwd = process.cwd();
const { Group } = Button;
const { useBcp, caseText, devText } = helper.readConf()!;

const onExport = async (data: CaseInfo, exportFile: ExtraAction) => {
    const db = getDb<DeviceType>(TableName.Devices);
    let exeDir = join(cwd, '../tools');
    let exeName = '';
    let fileName = '';
    let devList: DeviceType[] = [];

    try {
        devList = await db.find({ caseId: data._id });
    } catch (error) {
        console.log(error);
    }

    if (devList.length === 0) {
        message.destroy();
        message.info(`查无${devText ?? '设备'}数据`);
        return;
    }

    if (exportFile === ExtraAction.Excel) {
        exeDir = join(exeDir, 'create_excel_report');
        exeName = 'create_excel_report.exe';
        fileName = '违规检测结果报告.xlsx';
    } else {
        exeDir = join(exeDir, 'create_excel_report');
        exeName = 'create_pdf_report.exe';
        fileName = '违规检测结果报告.pdf';
    }

    const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
        title: '请选择目录',
        properties: ['openDirectory', 'createDirectory']
    });

    if (selectVal.filePaths && selectVal.filePaths.length > 0) {
        const [saveTarget] = selectVal.filePaths; //用户所选目标目录

        const handle = Modal.info({
            title: '导出',
            content: '正在导出报表，请稍等...',
            okText: '确定',
            centered: true,
            icon: <LoadingOutlined />,
            okButtonProps: { disabled: true }
        });

        console.log(join(exeDir, exeName));
        console.log([
            join(data.m_strCasePath, data.m_strCaseName),
            devList.map(item => item.phonePath).join('|'),
            saveTarget,
            '2'
        ]);

        const proc = execFile(join(exeDir, exeName),
            [
                join(data.m_strCasePath, data.m_strCaseName),
                devList.map(item => item.phonePath).join('|'),
                saveTarget,
                '2'
            ], {
            cwd: exeDir,
            windowsHide: true
        });
        proc.once('error', () => {
            handle.update({
                title: '导出',
                content: `报表导出失败`,
                okText: '确定',
                centered: true,
                icon: <CloseCircleOutlined />,
                okButtonProps: { disabled: false }
            });
        });
        proc.once('exit', () => {
            handle.update({
                onOk() {
                    shell.showItemInFolder(join(saveTarget, fileName));
                },
                title: '导出',
                content: `报表导出成功`,
                okText: '确定',
                centered: true,
                icon: <CheckCircleOutlined />,
                okButtonProps: { disabled: false }
            });
        });
        proc.once('close', () => {
            handle.update({
                onOk() {
                    shell.showItemInFolder(join(saveTarget, fileName));
                },
                title: '导出',
                content: `报表导出成功`,
                okText: '确定',
                centered: true,
                icon: <CheckCircleOutlined />,
                okButtonProps: { disabled: false }
            });
        });
    }
};

/**
 * 生成报告（案件下的所有设备）
 * @param data 案件数据
 */
const onCreateReport = (data: CaseInfo) => { };

/**
 * 表头定义
 * @param dispatch 派发方法
 * @param operateDoing OperateDoing仓库
 * @param setBatchExportReportModalVisible 显示/隐藏批量导出handle
 */
export function getCaseColumns(
    dispatch: Dispatch,
    operateDoing: OperateDoingState,
    setBatchExportReportModalVisible: (visible: boolean) => void,
    setExportBcpModalVisible: (visible: boolean) => void
): ColumnsType<CaseInfo> {
    let columns: ColumnType<CaseInfo>[] = [
        {
            title: `${caseText ?? '案件'}名称`,
            dataIndex: 'm_strCaseName',
            key: 'm_strCaseName',
            render: (value: string) => {
                const txt = value.includes('_') ? value.split('_')[0] : value;
                return <NoWrapText title={txt}>{txt}</NoWrapText>;
            }
        }, {
            title: '导出',
            dataIndex: '_id',
            key: '_id',
            width: 60,
            align: 'center',
            render: (id: string, record: CaseInfo) => {
                const { exportingDeviceId } = operateDoing;
                return <div>
                    <Group size="small">
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                dispatch({
                                    type: 'batchExportReportModal/queryDevicesByCaseId',
                                    payload: id
                                });
                                setBatchExportReportModalVisible(true);
                            }}
                            disabled={exportingDeviceId.length !== 0}
                            type="primary">
                            报告
                        </Button>
                        <Auth deny={!useBcp}>
                            <Button onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                dispatch({ type: 'exportBcpModal/setIsBatch', payload: true });
                                dispatch({ type: 'exportBcpModal/setExportBcpCase', payload: record });
                                setExportBcpModalVisible(true);
                            }} type="primary">
                                BCP
                            </Button>
                        </Auth>
                    </Group>
                </div>;
            }
        }, {
            dataIndex: '_id',
            key: 'more',
            align: 'center',
            render: (_: string, data: CaseInfo) => <Popover
                zIndex={9}
                trigger="click"
                content={
                    <Group>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                Modal.confirm({
                                    title: '生成报告',
                                    content: '可能所需时间较长，确定重新生成报告吗？',
                                    okText: '是',
                                    cancelText: '否',
                                    centered: true,
                                    onOk() {
                                        dispatch({ type: 'parseCase/createReport', payload: data });
                                    }
                                });
                            }}
                            type="primary"
                            size="small">生成报告</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onExport(data, ExtraAction.Excel);
                            }}
                            type="primary"
                            size="small">导出Excel报表</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onExport(data, ExtraAction.Pdf);
                            }}
                            type="primary"
                            size="small">导出PDF报表</Button>
                    </Group>
                }>
                <MoreOutlined style={{ color: '#0fb9b1', fontWeight: 'bold' }} />
            </Popover>
        }
    ];

    return columns;
}