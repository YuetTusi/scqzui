import { join } from 'path';
import { execFile } from 'child_process';
import { ipcRenderer } from 'electron';
import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import { ColumnsType, ColumnType } from "antd/lib/table";
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { getDb } from '@/utils/db';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import CaseInfo from "@/schema/case-info";
import { TableName } from '@/schema/table-name';
import DeviceType from '@/schema/device-type';
import { OperateDoingState } from '@/model/default/operate-doing';
import { NoWrapText } from './styled/style';

const cwd = process.cwd();
const { Group } = Button;
const { useBcp, caseText, devText } = helper.readConf()!;

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
            render: (id: string, { m_strCasePath, m_strCaseName }: CaseInfo) => <Popover
                zIndex={9}
                trigger="click"
                content={
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            Modal.confirm({
                                title: '批量生成报告',
                                content: '所需时间较长，确定批量生成报告吗？',
                                okText: '是',
                                cancelText: '否',
                                centered: true,
                                async onOk() {
                                    const db = getDb<DeviceType>(TableName.Devices);
                                    const exePath = join(cwd, '../tools/CreateReport');
                                    const nextId = helper.newId();
                                    try {
                                        const devices = await db.find({ caseId: id });
                                        if (devices.length === 0) {
                                            message.destroy();
                                            message.info(`无${devText ?? '设备'}数据`);
                                        } else {
                                            dispatch({
                                                type: 'alartMessage/addAlertMessage',
                                                payload: {
                                                    id: nextId,
                                                    msg: `正在批量生成「${`${m_strCaseName.split('_')[0]}`}」报告`
                                                }
                                            });
                                            dispatch({
                                                type: 'operateDoing/setCreatingDeviceId',
                                                payload: devices.map(item => item._id)
                                            });
                                            const proc = execFile(
                                                join(exePath, 'create_report.exe'),
                                                [m_strCasePath, devices.map(item => item.phonePath).join('|')]
                                            );
                                            proc.once('error', () => {
                                                message.destroy();
                                                notification.error({
                                                    type: 'error',
                                                    message: '报告生成失败',
                                                    description: '批量生成报告失败',
                                                    duration: 0
                                                });
                                                dispatch({
                                                    type: 'alartMessage/removeAlertMessage',
                                                    payload: nextId
                                                });
                                                dispatch({
                                                    type: 'operateDoing/clearCreatingDeviceId'
                                                });
                                            });
                                            proc.once('exit', () => {
                                                message.destroy();
                                                notification.success({
                                                    type: 'success',
                                                    message: '报告批量生成成功',
                                                    description: `「${`${m_strCaseName.split('_')[0]}`}」报告生成成功`,
                                                    duration: 0
                                                });
                                                dispatch({
                                                    type: 'alartMessage/removeAlertMessage',
                                                    payload: nextId
                                                });
                                                dispatch({
                                                    type: 'operateDoing/clearCreatingDeviceId'
                                                });
                                                ipcRenderer.send('show-progress', false);
                                            });
                                        }
                                    } catch (error) {
                                        log.error(`批量生成报告失败 @view/default/parse/case-list/column.tsx: ${error.message}`);
                                    }
                                }
                            });
                        }}
                        type="primary"
                        size="small">生成报告</Button>
                }>
                <MoreOutlined style={{ color: '#0fb9b1', fontWeight: 'bold' }} />
            </Popover>
        }
    ];

    return columns;
}