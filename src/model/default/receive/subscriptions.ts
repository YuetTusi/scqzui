import { ipcRenderer, IpcRendererEvent } from 'electron';
import { SubscriptionAPI } from 'dva';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import server, { send } from '@/utils/tcp-server';
import { LocalStoreKey } from '@/utils/local-store';
import { TableName } from '@/schema/table-name';
import { FetchLog } from '@/schema/fetch-log';
import { CommandType, SocketType, Command } from '@/schema/command';
import {
    deviceIn, deviceChange, deviceOut, fetchProgress, tipMsg, extraMsg,
    smsMsg, parseCurinfo, parseEnd, humanVerify, traceLogin, limitResult,
    appRecFinish, fetchPercent, importErr, backDatapass, checkFinishToParse
} from './listener';

const { Fetch, Parse, Trace, Error } = SocketType;
const { max, useTraceLogin, devText } = helper.readConf()!;

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
                    deviceIn(command, dispatch);
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
                case CommandType.ApkPhoneList:
                    dispatch({ type: 'apkModal/setPhone', payload: command.msg });
                    break;
                case CommandType.ApkList:
                    //# 接收apk列表消息
                    console.log(`接收到apk列表消息: ${command.msg}`);
                    dispatch({ type: 'apkModal/setApk', payload: command.msg });
                    break;
                case CommandType.ApkMsg:
                    //# 接收到apk提取消息
                    console.log(`接收到apk提取消息: ${command.msg}`);
                    dispatch({ type: 'apkModal/setMessage', payload: command.msg });
                    break;
                case CommandType.AndroidAuthList:
                    //# 接收安卓提权设备列表
                    console.log(`接收到破解列表: ${command.msg}`);
                    dispatch({ type: 'androidSetModal/setDev', payload: command.msg });
                    break;
                case CommandType.AntroidAuthMsg:
                    //# 接收安卓提权消息
                    console.log(`接收到破解消息: ${command.msg}`);
                    dispatch({ type: 'androidSetModal/setMessage', payload: command.msg });
                    break;
                case CommandType.Extraction:
                    //# 接收提取方式列表
                    console.log(`接收提取方式列表: ${command.msg}`);
                    dispatch({ type: 'extraction/setTypes', payload: command.msg.methods });
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
        checkFinishToParse(dispatch);
    },

    /**
     * Socket异常中断
     */
    socketDisconnect() {

        server.on(Error, async (port: number, type: string) => {

            logger.error(`Socket异常断开, port:${port}, type:${type}`);
            let content = '';
            switch (type) {
                case Fetch:
                    content = '采集服务器通讯异常中断或加密狗被拔出，请重启应用';
                    break;
                case Parse:
                    content = '解析服务器通讯异常中断或加密狗被拔出，请重启应用';
                    break;
                case Trace:
                    content = '应用查询服务器通讯异常中断或加密狗被拔出，请重启应用';
                    break;
                default:
                    content = '后台服务异常中断或加密狗被拔出，请重启应用';
                    break;
            }

            Modal.destroyAll();
            try {
                const isDebug = await helper.isDebug();

                if (isDebug) {
                    if (localStorage.getItem(LocalStoreKey.SocketWarning) === '1') {
                        Modal.confirm({
                            title: '警告',
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
                } else {
                    Modal.confirm({
                        title: '警告',
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

            } catch (error) {
                console.error(error);
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
    },
    /**
     * 加密狗报警
     */
    dogWarn() {

        ipcRenderer.on('dog-warn', async (_: IpcRendererEvent, msg: string) => {

            let isDebug = false;
            try {
                isDebug = await helper.isDebug();
            } catch (error) {
                isDebug = false;
            }
            if (!isDebug) {
                Modal.destroyAll();
                Modal.confirm({
                    title: '警告',
                    content: msg ?? '后台服务异常中断或加密狗被拔出，请重启应用',
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
    }
}