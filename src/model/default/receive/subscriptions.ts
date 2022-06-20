import { join } from 'path';
import { mkdirSync } from 'fs';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { SubscriptionAPI } from 'dva';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import server, { send } from '@/utils/tcp-server';
import { LocalStoreKey } from '@/utils/local-store';
import TipType from '@/schema/tip-type';
import { TableName } from '@/schema/table-name';
import { FetchLog } from '@/schema/fetch-log';
import { QuickRecord } from '@/schema/quick-record';
import CommandType, { SocketType, Command } from '@/schema/command';
import { ParseState } from '@/schema/device-state';
import { DataMode } from '@/schema/data-mode';
import { DeviceSystem } from '@/schema/device-system';
import { ParseCategory } from '@/schema/parse-detail';
import {
    deviceChange, deviceOut, fetchProgress, tipMsg, extraMsg, smsMsg,
    parseCurinfo, parseEnd, humanVerify, traceLogin, limitResult,
    appRecFinish, fetchPercent, importErr, backDatapass
} from './listener';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';
const { Fetch, Parse, Trace, Error } = SocketType;
const { max, useTraceLogin, devText, fetchText, parseText } = helper.readConf()!;

/**
 * 订阅
 */
export default {
    /**
     * 接收Fetch信息
     */
    receiveFetch({ dispatch }: SubscriptionAPI) {
        server.on(Fetch, (command: Command) => {
            switch (command.cmd) {
                case CommandType.Connect:
                    //#Socket连入后，告知采集路数
                    logger.info(`Fetch Connect`);
                    send(Fetch, {
                        type: Fetch,
                        cmd: CommandType.ConnectOK,
                        msg: { count: max }
                    });
                    break;
                case CommandType.DeviceIn:
                    console.log(`接收到设备连入:${JSON.stringify(command.msg)}`);
                    logger.info(`设备连入(DeviceIn)：${JSON.stringify(command.msg)}`);
                    dispatch({ type: 'device/checkWhenDeviceIn', payload: { usb: command.msg?.usb } });
                    dispatch({
                        type: 'device/setDeviceToList', payload: {
                            ...command.msg,
                            tipType: TipType.Nothing,
                            parseState: ParseState.NotParse,
                            isStopping: false
                        }
                    });
                    break;
                case CommandType.DeviceChange:
                    console.log(`设备状态更新:${JSON.stringify(command.msg)}`);
                    logger.info(`设备状态更新(DeviceChange)：${JSON.stringify(command.msg)}`);
                    deviceChange(command, dispatch);
                    break;
                case CommandType.FetchProgress:
                    console.log(`采集进度消息：${JSON.stringify(command.msg)}`);
                    logger.info(`采集进度消息：${JSON.stringify(command.msg)}`);
                    fetchProgress(command, dispatch);
                    break;
                case CommandType.FetchPercent:
                    console.log(`采集进度值：${JSON.stringify(command.msg)}`);
                    fetchPercent(command, dispatch);
                    break;
                case CommandType.DeviceOut:
                    logger.info(`设备移除(DeviceOut)：${JSON.stringify(command.msg)}`);
                    deviceOut(command, dispatch);
                    break;
                case CommandType.UserAlert:
                    Modal.destroyAll();
                    Modal.warning({
                        title: '警告',
                        content: `此${devText ?? '设备'}USB冲突`,
                        okText: '确定'
                    });
                    break;
                case CommandType.TipMsg:
                    console.log(`用户消息提示：${JSON.stringify(command.msg)}`);
                    logger.info(`接收消息(TipMsg)：${JSON.stringify(command.msg)}`);
                    tipMsg(command, dispatch);
                    break;
                case CommandType.TipClear:
                    console.log(`清理USB-${command.msg.usb}消息`);
                    logger.info(`清理消息(TipClear): USB-${command.msg.usb}`);
                    dispatch({ type: 'device/clearTip', payload: command.msg.usb });
                    break;
                case CommandType.SmsMsg:
                    console.log(`云取验证码进度消息-${command.msg.usb}消息`);
                    logger.info(`云取验证码进度消息(SmsMsg)-USB${command.msg.usb}`);
                    smsMsg(command, dispatch);
                    break;
                case CommandType.HumanVerify:
                    console.log(`图形验证码消息-${command.msg.usb}消息`);
                    logger.info(`图形验证码消息(HumanVerify)-USB${command.msg.usb}`);
                    humanVerify(command, dispatch);
                    break;
                case CommandType.ExtraMsg:
                    console.log(`多用户/隐私空间消息：${JSON.stringify(command.msg)}`);
                    logger.info(`多用户/隐私空间消息(ExtraMsg)：${JSON.stringify(command.msg)}`);
                    extraMsg(command, dispatch);
                    break;
                case CommandType.CrackList:
                    //# 接收破解设备列表
                    console.log(`接收到破解列表: ${command.msg}`);
                    dispatch({ type: 'crackModal/setDev', payload: command.msg });
                    break;
                case CommandType.CrackMsg:
                    //# 接收破解设备消息
                    console.log(`接收到破解消息: ${command.msg}`);
                    dispatch({ type: 'crackModal/setMessage', payload: command.msg });
                    break;
                default:
                    console.log('未知命令:', command.cmd);
                    break;
            }
        });
    },
    /**
     * 接收Parse消息
     */
    receiveParse({ dispatch }: SubscriptionAPI) {
        server.on(Parse, (command: Command) => {
            switch (command.cmd) {
                case CommandType.Connect:
                    logger.info(`Parse Connect`);
                    send(Parse, {
                        type: Parse,
                        cmd: CommandType.ConnectOK,
                        msg: { count: max }
                    });
                    break;
                case CommandType.ParseCurinfo:
                    //# 解析详情
                    parseCurinfo(command, dispatch);
                    break;
                case CommandType.ParseEnd:
                    //# 解析结束
                    parseEnd(command, dispatch);
                    break;
                case CommandType.BackDatapass:
                    //# 输入备份密码
                    backDatapass(command, dispatch);
                    break;
                case CommandType.ImportErr:
                    //# 导入第三方数据失败
                    importErr(command, dispatch);
                    break;
                default:
                    console.log('未知命令:', command.cmd);
                    break;
            }
        });
    },

    /**
     * 接收Trace消息
     */
    receiveTrace({ dispatch }: SubscriptionAPI) {
        server.on(Trace, (command: Command) => {
            switch (command.cmd) {
                case CommandType.Connect:
                    logger.info(`Trace Connect`);
                    send(Trace, {
                        type: Trace,
                        cmd: CommandType.ConnectOK,
                        msg: ''
                    });
                    if (useTraceLogin) {
                        //当trace连入之后，发送登录命令
                        dispatch({ type: 'traceLogin/loadUserToLogin' });
                    }
                    break;
                case CommandType.TraceLogin:
                case CommandType.TraceLoginResult:
                    traceLogin(command, dispatch);
                    break;
                case CommandType.LimitResult:
                    limitResult(command, dispatch);
                    break;
                case CommandType.AppRecResult:
                    appRecFinish(command, dispatch);
                    break;
                default:
                    console.log('未知命令:', command);
                    break;
            }
        });
    },
    /**
     * 接收快速点验消息
     */
    receiveCheck({ dispatch }: SubscriptionAPI) {
        ipcRenderer.on('check-parse', async (event: IpcRendererEvent, args: Record<string, any>) => {

            ipcRenderer.send('show-notice', {
                message: `「${args.mobileName ?? '未知设备'}」${fetchText ?? '取证'}结束，开始${parseText ?? '解析'}${fetchText ?? '点验'}数据`
            });

            const aiTempPath = isDev
                ? join(cwd, './data/predict.json')
                : join(cwd, './resources/config/predict.json');

            const [appJson, aiConfig] = await Promise.all([
                helper.readAppJson(),
                helper.readJSONFile(aiTempPath)
            ]);

            //NOTE:将设备数据入库
            let next = new QuickRecord();
            next._id = helper.newId();
            next.mobileHolder = args.mobileHolder ?? '';
            next.phonePath = args.phonePath ?? '';
            next.caseId = args.caseId ?? '';//所属案件id
            next.mobileNo = args.mobileNo ?? '';
            next.mobileName = `${args.mobileName ?? 'unknow'}_${helper.timestamp()}`;
            next.parseState = ParseState.Parsing;
            next.mode = DataMode.Check;
            next.fetchTime = new Date();
            next.mobileNumber = '';
            next.handleOfficerNo = '';
            next.note = '';
            next.cloudAppList = [];
            next.system = DeviceSystem.Android;

            let exist: boolean = await helper.existFile(next.phonePath!);
            if (!exist) {
                //手机路径不存在，创建之
                mkdirSync(next.phonePath!, { recursive: true });
            }
            //将设备信息写入Device.json
            await helper.writeJSONfile(join(next.phonePath!, 'Device.json'), {
                mobileHolder: next.mobileHolder ?? '',
                mobileNo: next.mobileNo ?? '',
                mobileName: next.mobileName ?? '',
                note: next.note ?? '',
                mode: next.mode ?? DataMode.Self
            });

            dispatch({
                type: 'quickRecordList/saveToEvent', payload: {
                    id: next.caseId,
                    data: next
                }
            });
            dispatch({ type: 'quickEventList/setSelectedRowKeys', payload: [next.caseId] });//选中案件
            dispatch({ type: 'quickRecordList/setExpandedRowKeys', payload: [next._id] });//展开点验设备

            //# 通知parse开始解析
            send(SocketType.Parse, {
                type: SocketType.Parse,
                cmd: CommandType.StartParse,
                msg: {
                    caseId: next.caseId,
                    deviceId: next._id,
                    category: ParseCategory.Quick,
                    phonePath: next.phonePath,
                    dataMode: DataMode.Check,
                    hasReport: true,
                    isDel: false,
                    isAi: false,
                    aiTypes: aiConfig,
                    useDefaultTemp: appJson?.useDefaultTemp ?? true,
                    useKeyword: appJson?.useKeyword ?? false,
                    useDocVerify: appJson?.useDocVerify ?? false,
                    tokenAppList: []
                }
            });
        });
    },

    /**
     * Socket异常中断
     */
    socketDisconnect() {

        server.on(Error, (port: number, type: string) => {

            logger.error(`Socket异常断开, port:${port}, type:${type}`);
            let content = '';
            switch (type) {
                case Fetch:
                    content = '采集服务通讯中断，请重启应用';
                    break;
                case Parse:
                    content = '解析服务通讯中断，请重启应用';
                    break;
                case Trace:
                    content = '应用查询服务中断，请重启应用';
                    break;
                default:
                    content = '后台服务通讯中断，请重启应用';
                    break;
            }

            if (localStorage.getItem(LocalStoreKey.SocketWarning) === '1') {
                Modal.destroyAll();
                Modal.confirm({
                    title: '服务中断',
                    content,
                    centered: true,
                    okText: '重新启动',
                    cancelText: '退出',
                    onOk() {
                        ipcRenderer.send('do-relaunch');
                    },
                    onCancel() {
                        ipcRenderer.send('do-close');
                    }
                });
            }
        });
    },
    /**
     * 接收主进程日志数据入库
     */
    saveFetchLog() {
        ipcRenderer.on('save-fetch-log', async (event: IpcRendererEvent, log: FetchLog) => {
            const db = getDb<FetchLog>(TableName.FetchLog);
            try {
                await db.insert(log);
            } catch (error) {
                logger.error(`采集进度入库失败 @model/default/receive/subscriptions/saveFetchLog: ${error.message}`);
            }
        });
    }
}