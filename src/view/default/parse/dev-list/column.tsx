import { join } from 'path';
import { access } from 'fs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { execFile } from 'child_process';
import { ipcRenderer, shell } from 'electron';
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
import { PredictJson } from '@/component/ai-switch/prop';
import { OperateDoingState } from '@/model/default/operate-doing';
import { CaseInfo } from '@/schema/case-info';
import { DeviceType } from "@/schema/device-type";
import { DeviceSystem } from '@/schema/device-system';
import { ParseState } from "@/schema/device-state";
import { DataMode } from '@/schema/data-mode';
import { TableName } from '@/schema/table-name';
import { ParseCategory } from '@/schema/parse-detail';
import { CommandType, SocketType } from '@/schema/command';
import { AppJson } from '@/schema/app-json';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import logger from '@/utils/log';

const { devText, fetchText, parseText } = helper.readConf()!;
const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';
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
                message.warning('数据不存在');
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
const doParse = debounce(async (dispatch: Dispatch, data: DeviceType) => {

    const db = getDb<CaseInfo>(TableName.Cases);
    const caseJsonPath = join(data.phonePath!, '../../');
    const aiTempAt = isDev
        ? join(cwd, './data/predict.json')
        : join(cwd, './resources/config/predict.json'); //AI配置模版所在路径

    try {
        const [caseData, caseJsonExist, appConfig, aiTemp]: [CaseInfo, boolean, AppJson | null, PredictJson]
            = await Promise.all([
                db.findOne({ _id: data.caseId }),
                helper.existFile(join(caseJsonPath, 'Case.json')),
                helper.readAppJson(),
                helper.readJSONFile(aiTempAt)
            ]);

        if (!caseJsonExist) {
            await helper.writeCaseJson(caseJsonPath, caseData);
        }

        let aiConfig: PredictJson = { similarity: 0, ocr: false, config: [] };
        const predictAt = join(caseData.m_strCasePath, caseData.m_strCaseName, 'predict.json');
        const exist = await helper.existFile(predictAt);
        if (exist) {
            aiConfig = await helper.readJSONFile(predictAt);
        }
        send(SocketType.Parse, {
            type: SocketType.Parse,
            cmd: CommandType.StartParse,
            msg: {
                caseId: data.caseId,
                deviceId: data._id,
                category: ParseCategory.Normal,
                phonePath: data.phonePath,
                ruleFrom: caseData.ruleFrom ?? 0,
                ruleTo: caseData.ruleTo ?? 8,
                hasReport: caseData?.hasReport ?? false,
                isDel: caseData?.isDel ?? false,
                isAi: caseData?.isAi ?? false,
                aiTypes: helper.combinePredict(aiTemp, aiConfig),
                useDefaultTemp: appConfig?.useDefaultTemp ?? true,
                useKeyword: appConfig?.useKeyword ?? false,
                useDocVerify: [
                    appConfig?.useDocVerify ?? false,
                    appConfig?.usePdfOcr ?? false
                ],
                dataMode: data.mode ?? DataMode.Self,
                tokenAppList: caseData.tokenAppList
                    ? caseData.tokenAppList.map((i) => i.m_strID)
                    : []
            }
        });
        dispatch({
            type: 'parseDev/updateParseState',
            payload: {
                id: data._id,
                parseState: ParseState.Parsing,
                pageIndex: 1
            }
        });
    } catch (error) {
        logger.error(`解析失败 @view/default/parse/dev-list/column.tsx:${error.message}`);
    }
}, 2000, { leading: true, trailing: false });

/**
 * 调用exe创建报告
 * @param props 组件属性
 * @param exePath create_report.exe所在路径
 * @param device 设备
 */
const runCreateReport = async (
    dispatch: Dispatch,
    exePath: string, {
        _id, caseId, mobileHolder, mobileName, mobileNo, mode, phonePath, note
    }: DeviceType) => {
    const db = getDb<CaseInfo>(TableName.Cases);
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
            const caseData: CaseInfo = await db.findOne({
                _id: caseId
            });
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
        logger.error(
            `写入JSON失败 @view/default/parse/dev-list/column: ${error.message}`
        );
    }

    const proc = execFile(exePath, [casePath, phonePath!], { cwd: exeCwd });
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
export function getDevColumns(
    dispatch: Dispatch,
    operateDoing: OperateDoingState,
    exportReportClick: (data: DeviceType) => void): ColumnsType<DeviceType> {

    const { creatingDeviceId, exportingDeviceId } = operateDoing;

    let columns: ColumnType<DeviceType>[] = [
        {
            title: '状态',
            dataIndex: 'parseState',
            key: 'parseState',
            width: '75px',
            align: 'center',
            render(state: ParseState) {
                switch (state) {
                    case ParseState.Fetching:
                        return <Tag style={{ marginRight: 0 }}>{`${fetchText ?? '取证'}中`}</Tag>;
                    case ParseState.NotParse:
                        return <Tag style={{ marginRight: 0 }}>{`未${parseText ?? '解析'}`}</Tag>;
                    case ParseState.Parsing:
                        return <Tag color="blue" style={{ marginRight: 0 }}>{`${parseText ?? '解析'}中`}</Tag>;
                    case ParseState.Finished:
                        return <Tag color="green" style={{ marginRight: 0 }}>完成</Tag>;
                    case ParseState.Error:
                        return <Tag color="red" style={{ marginRight: 0 }}>失败</Tag>;
                    case ParseState.Exception:
                        return <Tag color="red" style={{ marginRight: 0 }}>异常</Tag>;
                    default:
                        return <Tag>{`未${parseText ?? '解析'}`}</Tag>;
                }
            }
        },
        {
            title: `${devText ?? '设备'}`,
            dataIndex: 'mobileName',
            key: 'mobileName',
            render: (value: string, { system, mode, phonePath }: DeviceType) => {
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
            title: `${fetchText ?? '取证'}时间`,
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
                        disabled={parseButtonDisable(record.parseState!)}
                        onClick={async (event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            const treeJsonPath = join(
                                record.phonePath!,
                                './report/public/data/tree.json'
                            );
                            const reportPath = join(record.phonePath!, './report/index.html');
                            console.log(reportPath);
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
                            creatingDeviceId.some((i) => i === record._id)
                            || exportingDeviceId.length !== 0
                        }
                        type="primary">生成</Button>
                    <Button
                        disabled={parseButtonDisable(record.parseState!)}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            exportReportClick(record);
                        }}
                        type="primary">导出</Button>
                    <Button
                        disabled={parseButtonDisable(record.parseState!)}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            helper.runExe(
                                join(cwd, '../tools/SearchReport/reporter.exe'),
                                [record.phonePath ?? '']
                            );
                        }}
                        type="primary">
                        检索
                    </Button>
                </Group>
            }
        },
        {
            title: parseText ?? '解析',
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
                                    title: `重新${parseText ?? '解析'}`,
                                    content: `可能所需时间较长，确定重新${parseText ?? '解析'}吗？`,
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
                            message.warning('数据不存在');
                        }
                    }}>
                    {parseText ?? '解析'}
                </Button>
            }
        }
    ];

    return columns;
}