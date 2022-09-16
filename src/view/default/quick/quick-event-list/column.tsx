import { join } from 'path';
import { execFile } from 'child_process';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import React, { MouseEvent } from "react";
import { Dispatch } from "dva";
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
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

const cwd = process.cwd();
const { caseText, fetchText, devText } = helper.readConf()!;

const getColumns = (dispatch: Dispatch, ...handles: any[]): ColumnsType<QuickEvent> => {

    const [detailHandle] = handles;

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
            render: (id: string, { eventPath, eventName, _id }: QuickEvent) => <Popover
                zIndex={9}
                trigger="click"
                content={
                    <Button
                        onClick={async (event: MouseEvent<HTMLButtonElement>) => {
                            const db = getDb<QuickRecord>(TableName.QuickRecord);
                            event.stopPropagation();
                            const exeDir = join(cwd, '../tools/create_excel_report');
                            let recList: QuickRecord[] = [];
                            try {
                                recList = await db.find({ caseId: _id });
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
                                const casePath = join(eventPath, eventName);

                                const handle = Modal.info({
                                    title: '导出',
                                    content: '正在导出Excel报表，请稍等...',
                                    okText: '确定',
                                    centered: true,
                                    icon: <CheckCircleOutlined />,
                                    okButtonProps: { disabled: true }
                                });

                                const proc = execFile(join(exeDir, 'create_excel_report.exe'),
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
                                        okButtonProps: { disabled: false }
                                    });
                                });
                                proc.once('exit', () => {
                                    handle.update({
                                        onOk() {
                                            shell.showItemInFolder(join(saveTarget, '违规检测结果报告.xlsx'));
                                        },
                                        title: '导出',
                                        content: `报表导出成功`,
                                        okText: '确定',
                                        centered: true,
                                        okButtonProps: { disabled: false }
                                    });
                                });
                                proc.once('close', () => {
                                    handle.update({
                                        onOk() {
                                            shell.showItemInFolder(join(saveTarget, '违规检测结果报告.xlsx'));
                                        },
                                        title: '导出',
                                        content: `报表导出成功`,
                                        okText: '确定',
                                        centered: true,
                                        okButtonProps: { disabled: false }
                                    });
                                });
                            }
                        }}
                        type="primary"
                        size="small">导出报表</Button>
                }>
                <MoreOutlined style={{ color: '#0fb9b1', fontWeight: 'bold' }} />
            </Popover>
        }
    ];
}

export { getColumns };