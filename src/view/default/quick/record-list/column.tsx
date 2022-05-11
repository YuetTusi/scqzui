import debounce from 'lodash/debounce';
import { join } from 'path';
import { access } from 'fs';
import dayjs from 'dayjs';
import { execFile } from 'child_process';
import { ipcRenderer, shell } from 'electron';
import classnames from 'classnames';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import CloudFilled from '@ant-design/icons/CloudFilled';
import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import { ColumnsType, ColumnType } from "antd/lib/table";
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import { OperateDoingState } from '@/model/default/operate-doing';
import { QuickRecord } from "@/schema/quick-record";
import { ParseState } from "@/schema/device-state";
import DeviceSystem from '@/schema/device-system';
import { DataMode } from '@/schema/data-mode';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { CaseInfo } from '@/schema/case-info';
import { ParseCategory } from '@/schema/parse-detail';
import CommandType, { SocketType } from '@/schema/command';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import logger from '@/utils/log';

const cwd = process.cwd();
const { Group } = Button;

/**
 * 解析是否为禁用状态
 */
const parseButtonDisable = (state: ParseState) => {
    switch (state) {
        case ParseState.Parsing:
        case ParseState.Fetching:
        case ParseState.Exception:
            return true;
        default:
            return false;
    }
};

/**
 * 使用系统窗口打开路径
 */
const openOnSystemWindow = debounce(
    (defaultPath: string) => {
        access(defaultPath, (err) => {
            if (err) {
                message.destroy();
                message.warning('取证数据不存在');
            } else {
                shell.showItemInFolder(defaultPath);
            }
        });
    },
    896,
    { leading: true, trailing: false }
);

/**
 * 执行解析
 * @param dispatch Dispatch
 * @param data 设备数据
 */
const doParse = async (dispatch: Dispatch, data: QuickRecord) => {

    const db = getDb<QuickEvent>(TableName.QuickEvent);
    try {
        let eventData: QuickEvent = await db.findOne({
            _id: data.caseId
        });
        let caseJsonPath = join(data.phonePath!, '../../');
        let caseJsonExist = await helper.existFile(join(caseJsonPath, 'Case.json'));

        if (!caseJsonExist) {
            const caseData = new CaseInfo();
            caseData.m_strCaseName = eventData.eventName;
            caseData.m_strCasePath = eventData.eventPath;
            await helper.writeCaseJson(caseJsonPath, caseData);
        }
        send(SocketType.Parse, {
            type: SocketType.Parse,
            cmd: CommandType.StartParse,
            msg: {
                caseId: data.caseId,
                deviceId: data._id,
                category: ParseCategory.Quick,
                phonePath: data.phonePath,
                hasReport: true,
                isDel: false,
                isAi: false,
                aiTypes: Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
                useKeyword: true,
                useDocVerify: false,
                dataMode: DataMode.Check,
                tokenAppList: []
            }
        });
        dispatch({
            type: 'quickRecordList/updateParseState',
            payload: {
                id: data._id,
                parseState: ParseState.Parsing,
                pageIndex: 1
            }
        });
    } catch (error) {
        logger.error(`解析快速点验设备失败 @view/default/quick/record-list/column:${error.message}`);
    }
};

/**
 * 调用exe创建报告
 * @param props 组件属性
 * @param exePath create_report.exe所在路径
 * @param device 设备
 */
const runCreateReport = async (dispatch: Dispatch, exePath: string, device: QuickRecord) => {
    const {
        _id, caseId, mobileHolder, mobileName, mobileNo, mode, phonePath, note
    } = device;
    const db = getDb<QuickEvent>(TableName.QuickEvent);
    const casePath = join(phonePath!, '../../'); //案件路径
    const exeCwd = join(cwd, '../tools/CreateReport');
    const msg = new AlartMessageInfo({
        id: helper.newId(),
        msg: `正在生成「${`${mobileHolder}-${mobileName?.split('_')[0]}`}」报告`
    });
    message.info('开始生成报告');
    dispatch({
        type: 'alartMessage/addAlertMessage',
        payload: msg
    }); //显示全局消息
    dispatch({
        type: 'operateDoing/addCreatingDeviceId',
        payload: _id
    });
    ipcRenderer.send('show-progress', true);
    try {
        const caseJsonPath = join(casePath, 'Case.json');
        const deviceJsonPath = join(phonePath!, 'Device.json');
        const [caseJsonExist, deviceJsonExist] = await Promise.all([
            helper.existFile(caseJsonPath),
            helper.existFile(deviceJsonPath)
        ]);

        if (!caseJsonExist) {
            const eventData: QuickEvent = await db.findOne({
                _id: caseId
            });
            const caseData = new CaseInfo();
            caseData.m_strCaseName = eventData.eventName;
            caseData.m_strCasePath = eventData.eventPath;
            await helper.writeCaseJson(casePath, caseData);
        }
        if (!deviceJsonExist) {
            await helper.writeJSONfile(deviceJsonPath, {
                mobileHolder: mobileHolder ?? '',
                mobileNo: mobileNo ?? '',
                mobileName: mobileName ?? '',
                note: note ?? '',
                mode: mode ?? DataMode.Self
            });
        }
    } catch (error) {
        logger.error(`写入JSON失败 @view/default/quick/record-list/column: ${error.message}`);
    }

    const proc = execFile(exePath, [casePath, device.phonePath!], { cwd: exeCwd });
    proc.once('error', () => {
        message.destroy();
        notification.error({
            type: 'error',
            message: '报告生成失败',
            description: `「${mobileHolder}-${mobileName?.split('_')[0]}」报告生成失败`,
            duration: 0
        });
        dispatch({
            type: 'alartMessage/removeAlertMessage',
            payload: msg.id
        });
        dispatch({
            type: 'operateDoing/removeCreatingDeviceId',
            payload: _id
        });
        ipcRenderer.send('show-progress', false);
    });
    proc.once('exit', () => {
        message.destroy();
        notification.success({
            type: 'success',
            message: '报告生成成功',
            description: `「${mobileHolder}-${mobileName?.split('_')[0]}」报告生成成功`,
            duration: 0
        });
        dispatch({
            type: 'alartMessage/removeAlertMessage',
            payload: msg.id
        });
        dispatch({
            type: 'operateDoing/removeCreatingDeviceId',
            payload: _id
        });
        ipcRenderer.send('show-progress', false);
    });
};


/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getColumns(
    dispatch: Dispatch,
    operateDoing: OperateDoingState,
    exportReportClick: (data: QuickRecord) => void): ColumnsType<QuickRecord> {

    const { creatingDeviceId, exportingDeviceId } = operateDoing;

    let columns: ColumnType<QuickRecord>[] = [
        {
            title: '状态',
            dataIndex: 'parseState',
            key: 'parseState',
            width: '75px',
            align: 'center',
            render(state: ParseState) {
                switch (state) {
                    case ParseState.Fetching:
                        return <Tag style={{ marginRight: 0 }}>采集中</Tag>;
                    case ParseState.NotParse:
                        return <Tag style={{ marginRight: 0 }}>未解析</Tag>;
                    case ParseState.Parsing:
                        return <Tag color="blue" style={{ marginRight: 0 }}>解析中</Tag>;
                    case ParseState.Finished:
                        return <Tag color="green" style={{ marginRight: 0 }}>完成</Tag>;
                    case ParseState.Error:
                        return <Tag color="red" style={{ marginRight: 0 }}>失败</Tag>;
                    case ParseState.Exception:
                        return <Tag color="red" style={{ marginRight: 0 }}>异常</Tag>;
                    default:
                        return <Tag style={{ marginRight: 0 }}>未解析</Tag>;
                }
            }
        },
        {
            title: '手机',
            dataIndex: 'mobileName',
            key: 'mobileName',
            render: (value: string, { system, mode, phonePath }: QuickRecord) => {
                return <div>
                    <span>
                        {
                            system === DeviceSystem.IOS
                                ? <AppleFilled title="苹果设备" />
                                : <AndroidFilled style={{ color: '#76c058' }} title="安卓设备" />
                        }
                        {
                            mode === DataMode.ServerCloud
                                ? <CloudFilled style={{ marginLeft: '5px' }} title="云取证" className="cloud-color" />
                                : null
                        }
                    </span>
                    <a
                        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                            event.stopPropagation();
                            openOnSystemWindow(phonePath!);
                        }}
                        className={classnames({ 'cloud-color': mode === DataMode.ServerCloud })}
                        style={{ marginLeft: '5px' }}>
                        {value.split('_')[0]}
                    </a>
                </div>;
            }
        },
        {
            title: '持有人',
            dataIndex: 'mobileHolder',
            key: 'mobileHolder'
        },
        {
            title: '点验时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: '160px',
            render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '报告',
            dataIndex: '_id',
            key: '_id',
            align: 'center',
            width: '150px',
            render: (id: string, record) => {
                return <Group size="small">
                    <Button
                        onClick={async (event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            const treeJsonPath = join(
                                record.phonePath!,
                                './report/public/data/tree.json'
                            );
                            const reportPath = join(record.phonePath!, './report/index.html');
                            let exist = await helper.existFile(treeJsonPath);
                            if (exist) {
                                shell.openPath(reportPath);
                            } else {
                                message.destroy();
                                message.info('未生成报告，请重新生成报告后进行查看');
                            }
                        }}
                        type="primary">查看</Button>
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            const exe = join(cwd, '../tools/CreateReport/create_report.exe');
                            Modal.confirm({
                                title: '生成报告',
                                content: '可能所需时间较长，确定重新生成报告吗？',
                                okText: '是',
                                cancelText: '否',
                                centered: true,
                                onOk() {
                                    runCreateReport(dispatch, exe, record);
                                }
                            });
                        }}
                        disabled={
                            creatingDeviceId.some((i) => i === record._id) ||
                            exportingDeviceId.length !== 0 ||
                            (record.parseState !== ParseState.Finished
                                && record.parseState !== ParseState.Error)
                        }
                        type="primary">生成</Button>
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            exportReportClick(record);
                        }}
                        type="primary">导出</Button>
                </Group>
            }
        },
        {
            title: '解析',
            dataIndex: '_id',
            key: '_id',
            align: 'center',
            width: '60px',
            render: (id: string, record) => {
                return <Button
                    type="primary"
                    size="small"
                    disabled={parseButtonDisable(record.parseState!)}
                    onClick={async (event: MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        let exist = await helper.existFile(record.phonePath!);
                        if (exist) {
                            if (record.parseState === ParseState.NotParse) {
                                doParse(dispatch, record);
                            } else {
                                Modal.confirm({
                                    title: '重新解析',
                                    content: '可能所需时间较长，确定重新解析吗？',
                                    okText: '是',
                                    cancelText: '否',
                                    centered: true,
                                    onOk() {
                                        doParse(dispatch, record);
                                    }
                                });
                            }
                        } else {
                            message.destroy();
                            message.warning('取证数据不存在');
                        }
                    }}>
                    解析
                </Button>
            }
        }
    ];

    return columns;
}
