import { join } from 'path';
import { execFile } from 'child_process';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import React, { MouseEvent } from "react";
import { Dispatch } from "dva";
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined';
import { ColumnsType } from "antd/lib/table";
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { QuickEvent } from "@/schema/quick-event";
import { NowrapText } from './styled/style';
import Popover from "antd/lib/popover";
import Button from "antd/lib/button";
import message from 'antd/lib/message';
import { getDb } from '@/utils/db';
import { TableName } from '@/schema/table-name';
import { QuickRecord } from '@/schema/quick-record';
import { ExportFile } from '../prop';

const cwd = process.cwd();
const { caseText, fetchText, devText } = helper.readConf()!;
const { Group } = Button;

const onExport = async (data: QuickEvent, exportType: ExportFile) => {
    const db = getDb<QuickRecord>(TableName.QuickRecord);
    let exeDir = join(cwd, '../tools');
    let exeName = '';
    let fileName = '';
    let recList: QuickRecord[] = [];
    try {
        recList = await db.find({ caseId: data._id });
    } catch (error) {
        console.log(error);
    }

    if (recList.length === 0) {
        message.destroy();
        message.info(`查无${devText ?? '设备'}数据`);
        return;
    }

    const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
        title: '请选择目录',
        properties: ['openDirectory', 'createDirectory']
    });

    if (selectVal.filePaths && selectVal.filePaths.length > 0) {
        const [saveTarget] = selectVal.filePaths; //用户所选目标目录
        const casePath = join(data.eventPath, data.eventName);

        const handle = Modal.info({
            title: '导出',
            content: '正在导出报表，请稍等...',
            okText: '确定',
            centered: true,
            icon: <LoadingOutlined />,
            okButtonProps: { disabled: true }
        });

        switch (exportType) {
            case ExportFile.Excel:
                exeDir = join(exeDir, 'create_excel_report');
                exeName = 'create_excel_report.exe';
                fileName = '违规检测结果报告.xlsx';
                break;
            case ExportFile.Pdf:
                exeDir = join(exeDir, 'create_excel_report');
                exeName = 'create_pdf_report.exe';
                fileName = '违规检测结果报告.pdf';
                break;
            case ExportFile.Word:
                exeDir = join(exeDir, 'create_excel_report');
                exeName = 'create_word_report.exe';
                fileName = '违规检测结果报告.docx';
                break;
        }

        const proc = execFile(join(exeDir, exeName),
            [
                casePath,
                recList.map(item => item.phonePath).join('|'),
                saveTarget,
                '1'
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

const getColumns = (dispatch: Dispatch, ...handles: any[]): ColumnsType<QuickEvent> => {

    const [detailHandle, batchExportReportHandle] = handles;

    return [
        {
            title: '',
            dataIndex: '_id',
            key: 'qr',
            width: 20,
            align: 'center',
            render(value: string, record) {
                return <QrcodeOutlined
                    onClick={(e: MouseEvent<HTMLSpanElement>) => {
                        e.stopPropagation();
                        detailHandle(record);
                    }}
                    className="primary-color"
                    title={`扫码${fetchText ?? '点验'}`} />
            }
        },
        {
            title: `${caseText ?? '案件'}名称`,
            dataIndex: 'eventName',
            key: 'eventName',
            render(value: string, record) {
                const [name] = value.split('_');
                return <NowrapText onClick={async (e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
                    detailHandle(record);
                }}>
                    {name}
                </NowrapText>
            }
        },
        {
            title: '编辑',
            dataIndex: 'edit',
            key: 'edit',
            width: 50,
            align: 'center',
            render(value: string, record) {
                return <a onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
                    dispatch({ type: 'editQuickEventModal/setData', payload: record });
                    dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
                }}>编辑</a>
            }
        },
        {
            title: '删除',
            dataIndex: '_id',
            key: 'del',
            width: 50,
            align: 'center',
            render(value: string, { eventName }) {
                return <a onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
                    const [name] = eventName.split('_');
                    Modal.confirm({
                        onOk() {
                            dispatch({ type: 'quickEventList/del', payload: value });
                        },
                        title: `删除${caseText ?? '案件'}`,
                        content: `确认删除「${name}」？`,
                        okText: '是',
                        cancelText: '否',
                        centered: true
                    });
                }}>删除</a>
            }
        }, {
            dataIndex: '_id',
            key: 'more',
            align: 'center',
            width: 10,
            // render: () => <MoreOutlined style={{ cursor: 'not-allowed' }} />
            render: (_: string, record: QuickEvent) => <Popover
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
                                        dispatch({ type: 'quickEventList/createReport', payload: record });
                                    }
                                });
                            }}
                            type="primary"
                            size="small">生成报告</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                batchExportReportHandle(record);
                            }}
                            type="primary"
                            size="small">导出报告</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onExport(record, ExportFile.Excel);
                            }}
                            type="primary"
                            size="small">导出Excel报表</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onExport(record, ExportFile.Pdf);
                            }}
                            type="primary"
                            size="small">导出PDF报表</Button>
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                onExport(record, ExportFile.Word);
                            }}
                            type="primary"
                            size="small">导出Word</Button>
                    </Group>
                }>
                <MoreOutlined style={{ color: '#0fb9b1', fontWeight: 'bold' }} />
            </Popover>
        }
    ];
}

export { getColumns };