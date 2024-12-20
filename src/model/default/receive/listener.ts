import { join } from 'path';
import { mkdirSync } from 'fs';
import { execFile } from 'child_process';
import groupBy from 'lodash/groupBy';
import { Dispatch } from "dva";
import { ipcRenderer, IpcRendererEvent } from "electron";
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import logger from "@/utils/log";
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { caseStore } from "@/utils/local-store";
import inputPassword from '@/component/dialog/input-password';
import { DatapassParam } from '@/component/dialog/input-password/prop';
import Command, { CommandType, SocketType } from "@/schema/command";
import DeviceType from "@/schema/device-type";
import { FetchState, ParseState } from "@/schema/device-state";
import { FetchProgress } from "@/schema/fetch-record";
import GuideImage from "@/schema/guide-image";
import TipType, { ReturnButton } from "@/schema/tip-type";
import ParseDetail, { ParseCategory } from "@/schema/parse-detail";
import { ParseEnd } from "@/schema/parse-log";
import { CaseInfo } from "@/schema/case-info";
import { TableName } from "@/schema/table-name";
import { HumanVerify } from '@/schema/human-verify';
import { DataMode } from '@/schema/data-mode';
import { CaptchaMsg, CloudAppMessages } from '@/schema/cloud-app-messages';
import { QuickEvent } from '@/schema/quick-event';
import { QuickRecord } from '@/schema/quick-record';
import { DeviceSystem } from '@/schema/device-system';
import { LoginState } from '../trace-login';

const { fetchText, parseText } = helper.readConf()!;
const appPath = process.cwd();

/**
 * 设备连入
 */
export function deviceIn({ msg }: Command<DeviceType>, dispatch: Dispatch<any>) {

    let samsungTip: string | undefined;
    let info = msg.phoneInfo?.find((i) => i.name === '系统版本');
    if ('samsung' === msg.manufacturer?.toLowerCase() && Number(info?.value) >= 12) {
        samsungTip = '请使用工具箱中「三星换机备份」进行数据采集';
    }

    dispatch({ type: 'device/checkWhenDeviceIn', payload: { usb: msg.usb } });
    dispatch({
        type: 'device/setDeviceToList', payload: {
            ...msg,
            tipType: TipType.Nothing,
            parseState: ParseState.NotParse,
            isStopping: false,
            extra: samsungTip
        }
    });
}

/**
 * 设备状态变化
 */
export function deviceChange({ msg }: Command<{
    /** USB序号 */
    usb: number,
    /** 采集状态 */
    fetchState: FetchState,
    /** 设备厂商 */
    manufacturer: string,
    /** 模式 */
    mode: DataMode,
    /** 云取应用列表 */
    cloudAppList: CloudAppMessages[]
}>, dispatch: Dispatch<any>) {

    const { fetchState, cloudAppList, mode, manufacturer, usb } = msg;

    if (fetchState !== FetchState.Fetching) {
        //NOTE:停止计时
        ipcRenderer.send('time', usb - 1, false);
        dispatch({ type: 'device/clearTip', payload: usb });
        dispatch({
            type: 'device/updateProp', payload: {
                usb,
                name: 'isStopping',
                value: false
            }
        });
    }
    if (fetchState === FetchState.Finished || fetchState === FetchState.HasError) {
        //NOTE: 采集结束(成功或失败)

        if (mode === DataMode.ServerCloud) {
            //云取
            //# 将云取成功状态设置到cloudCodeModal模型中，会根据状态分类着色，并写入日志
            dispatch({ type: 'cloudCodeModal/setState', payload: { usb, apps: cloudAppList } });
            dispatch({ type: 'cloudCodeModal/saveCloudLog', payload: { usb } });
        } else {
            //非云取
            //向FetchInfo组件发送消息，清理上一次缓存消息
            ipcRenderer.send('fetch-over', usb);
            //#记录日志
            dispatch({ type: 'device/saveFetchLog', payload: { usb, state: fetchState } });
        }
        //发送Windows消息
        ipcRenderer.send('show-notice', {
            message: `终端 #${usb}「${manufacturer}」${fetchText ?? '取证'}结束`
        });
        //#开始解析
        dispatch({ type: 'device/startParse', payload: usb });
    }
    dispatch({
        type: 'device/updateProp', payload: {
            usb,
            name: 'fetchState',
            value: fetchState
        }
    });
}

/**
 * 设备拔出
 */
export function deviceOut({ msg }: Command<DeviceType>, dispatch: Dispatch<any>) {
    const { usb } = msg;
    console.log(`设备断开:USB#${usb}`);
    //NOTE:清除进度日志
    ipcRenderer.send('progress-clear', usb);
    //NOTE:停止计时
    ipcRenderer.send('time', usb! - 1, false);
    //NOTE:清除进度缓存
    ipcRenderer.send('fetch-over', usb);

    //NOTE:清理案件数据
    caseStore.remove(usb!);
    dispatch({ type: 'device/checkWhenDeviceIn', payload: { usb } });
    dispatch({ type: 'device/removeDevice', payload: usb });
    dispatch({ type: 'cloudCodeModal/clearApps', payload: usb });
}

/**
 * 接收采集进度消息
 * @param msg.usb USB序号
 * @param msg.type 为分类，非0的数据入库
 * @param msg.info 消息内容
 */
export function fetchProgress({ msg }: Command<FetchProgress>, dispatch: Dispatch<any>) {
    ipcRenderer.send('fetch-progress', {
        usb: msg.usb,
        fetchRecord: { type: msg.type, info: msg.info, time: new Date() }
    });
}

/**
 * 接收采集进度百分比值
 * @param msg.usb USB序号
 * @param msg.value 百分比（0~100）
 */
export function fetchPercent({ msg }: Command<{ usb: number, value: number }>, dispatch: Dispatch<any>) {
    const { usb, value } = msg;
    dispatch({
        type: 'device/updateProp', payload: {
            usb,
            name: 'fetchPercent',
            value
        }
    });
}

/**
 * 接收用户消息（闪烁消息）
 */
export function tipMsg({ msg }: Command<{
    usb: number,
    type: TipType,
    title: string,
    content: string,
    image: GuideImage,
    yesButton: ReturnButton,
    noButton: ReturnButton
}>,
    dispatch: Dispatch<any>) {
    ipcRenderer.send('show-notification', {
        message: `「终端${msg.usb}」有新消息`
    });

    dispatch({
        type: 'device/setTip', payload: {
            usb: msg.usb,
            tipType: msg.type,
            tipTitle: msg.title,
            tipContent: msg.content,
            tipImage: msg.image,
            tipYesButton: msg.yesButton,
            tipNoButton: msg.noButton
        }
    });
}

/**
 * 接收短信云取证验证码详情（单条）
 */
export function smsMsg({ msg }: Command<{
    usb: number,
    appId: string,
    disabled: boolean,
    message: CaptchaMsg
}>, dispatch: Dispatch<any>) {
    const { usb, appId, disabled } = msg;
    dispatch({
        type: 'cloudCodeModal/appendMessage', payload: {
            usb,
            disabled,
            m_strID: appId,
            message: { ...msg.message, actionTime: new Date() }
        }
    });
}

/**
 * 接收图形验证数据（滑块&点选文字）
 * 当isUrl为true，表示是一个验证地址，直接打开即可
 */
export function humanVerify({ msg }: Command<{
    usb: number,
    appId: string,
    isUrl: boolean,
    humanVerifyData: HumanVerify | string | null
}>, dispatch: Dispatch<any>) {

    dispatch({
        type: 'cloudCodeModal/setHumanVerifyData', payload: {
            usb: msg.usb,
            m_strID: msg.appId,
            isUrl: msg.isUrl,
            humanVerifyData: msg.humanVerifyData
        }
    });
}

/**
 * 接收手机多用户/隐私空间消息
 */
export function extraMsg({ msg }: Command<{ usb: number, content: string }>, dispatch: Dispatch<any>) {
    dispatch({
        type: 'device/updateProp',
        payload: { usb: msg.usb, name: 'extra', value: msg.content }
    });
}

/**
 * 解析详情
 */
export function parseCurinfo({ msg }: Command<ParseDetail[]>, dispatch: Dispatch<any>) {

    const grp = groupBy(msg, (item) => item.category);
    //# 按category分组，将`标准取证`和`快速点验`详情分别派发到对应的model中
    dispatch({ type: 'parsingList/setInfo', payload: grp[ParseCategory.Normal] ?? [] }); //标准
    dispatch({ type: 'checkingList/setInfo', payload: grp[ParseCategory.Quick] ?? [] }); //快采
}

/**
 * 解析结束
 */
export async function parseEnd({ msg }: Command<ParseEnd>, dispatch: Dispatch<any>) {

    const caseDb = getDb<CaseInfo>(TableName.Cases);
    const deviceDb = getDb<DeviceType>(TableName.Devices);
    const { caseId, deviceId, isparseok, errmsg, category } = msg;

    console.log('解析结束：', JSON.stringify(msg));
    logger.info(`解析结束(ParseEnd): ${JSON.stringify(msg)}`);
    if (ParseCategory.Quick === category) {
        //快速点验
        dispatch({ type: 'checkingList/removeRecord', payload: deviceId });//从点验列表中移除
        dispatch({
            type: 'quickRecordList/updateParseState', payload: {
                id: deviceId,
                parseState: isparseok ? ParseState.Finished : ParseState.Error
            }
        }); //更新解析状态
        dispatch({ type: 'device/saveQuickLog', payload: msg }); //写入日志
    } else {
        //标准取证
        try {
            let [caseData, deviceData]: [CaseInfo, DeviceType] = await Promise.all([
                caseDb.findOne({ _id: caseId }),
                deviceDb.findOne({ _id: deviceId })
            ]);
            if (isparseok && caseData.generateBcp) {
                //# 解析`成功`且`是`自动生成BCP
                logger.info(`解析结束开始自动生成BCP, 手机路径：${deviceData.phonePath}`);
                const bcpExe = join(appPath, '../tools/BcpTools/BcpGen.exe');
                const attachment = typeof caseData.attachment === 'boolean'
                    ? Number(caseData.attachment)
                    : caseData.attachment;
                const proc = execFile(bcpExe, [deviceData.phonePath!, attachment.toString()], {
                    windowsHide: true,
                    cwd: join(appPath, '../tools/BcpTools')
                });
                // proc.once('close', () => {
                //     dispatch({
                //         type: 'parseDev/queryDev', payload: {
                //             condition: null,
                //             pageIndex: 1,
                //             pageSize: 5
                //         }
                //     });
                // });
                proc.once('error', (err) => {
                    logger.error(`自动生成BCP错误 @model/default/receive/listener/parseEnd: ${err.message}`);
                });
            }
            if (!isparseok && !helper.isNullOrUndefined(errmsg)) {
                Modal.error({
                    title: `${parseText ?? '解析'}失败`,
                    content: errmsg,
                    okText: '确定'
                });
            }
        } catch (error) {
            logger.error(`自动生成BCP错误 @model/default/receive/listener/parseEnd: ${error.message}`);
        } finally {
            //# 更新解析状态为`完成或失败`状态
            dispatch({
                type: 'parseDev/updateParseState', payload: {
                    id: deviceId,
                    parseState: isparseok ? ParseState.Finished : ParseState.Error
                }
            });
            dispatch({ type: 'parsingList/removeDevice', payload: deviceId });
        }
        //# 保存日志
        dispatch({ type: 'device/saveParseLog', payload: msg });
    }
}

/**
 * 提示用户输入密码
 */
export function backDatapass({ msg }: Command<DatapassParam>, dispatch: Dispatch<any>) {

    inputPassword(msg, (params: any, forget: boolean, password?: string) => {

        send(SocketType.Parse, {
            type: SocketType.Parse,
            cmd: CommandType.ConfirmDatapass,
            msg: {
                forget,
                password,
                ...params
            }
        });
    });
}

/**
 * 导入第三方数据失败
 */
export function importErr({ msg }: Command<{
    caseId: string,
    deviceId: string,
    mobileName: string,
    msg: string
}>, dispatch: Dispatch) {

    const db = getDb<DeviceType>(TableName.Devices);

    db.findOne({ _id: msg.deviceId })
        .then((data) => {
            const [mobileName] = data.mobileName!.split('_');
            Modal.error({
                title: `「${mobileName}」导入数据失败`,
                content: msg.msg,
                okText: '确定'
            });
        }).catch(() => {
            Modal.error({
                title: `第三方数据导入失败`,
                okText: '确定'
            });
        });
}

/**
 * 接收登录结果
 */
export function traceLogin({ msg }: Command<{
    success: boolean, message: string
}>,
    dispatch: Dispatch<any>) {
    const { success, message } = msg;
    if (success) {
        dispatch({
            type: 'traceLogin/setLoginState',
            payload: LoginState.IsLogin
        });
        dispatch({
            type: 'traceLogin/setLoginMessage',
            payload: `${message}已登录`
        });
    } else {
        dispatch({
            type: 'traceLogin/setLoginState',
            payload: LoginState.LoginError
        });
        dispatch({
            type: 'traceLogin/setLoginMessage',
            payload: message
        });
    }
}

/**
 * 接收剩余次数
 */
export function limitResult({ msg }: Command<{
    app_limit: number,
    poly_limit: number,
    username: string
}>, dispatch: Dispatch<any>) {
    dispatch({ type: 'traceLogin/setLimitCount', payload: msg.app_limit ?? 0 });
}

/**
 * 接收App痕迹查询结果
 */
export function appRecFinish({ msg }: Command<{
    value: string,
    info: string
}>, dispatch: Dispatch<any>) {

    message.destroy();
    message.info(msg.info ?? '');
    dispatch({ type: 'trail/readAppQueryJson', payload: { value: msg.value } });
    dispatch({ type: 'appSet/setReading', payload: false })
}

/**
 * 快速点验采集结束，接收数据进行解析
 */
export function checkFinishToParse(dispatch: Dispatch<any>) {
    const db = getDb<QuickEvent>(TableName.QuickEvent);
    ipcRenderer.on('check-parse', async (_: IpcRendererEvent, args: Record<string, any>) => {

        ipcRenderer.send('show-notice', {
            message: `「${args.mobileName ?? '未知设备'}」${fetchText ?? '取证'}结束，开始${parseText ?? '解析'}${fetchText ?? '点验'}数据`
        });

        const [appJson, eventData] = await Promise.all([
            helper.readAppJson(),
            db.findOne({ _id: args.caseId })
        ]);

        const aiConfig = await helper.readJSONFile(join(eventData.eventPath, eventData.eventName, 'predict.json'));

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
                ruleFrom: eventData?.ruleFrom ?? 0,
                ruleTo: eventData?.ruleTo ?? 8,
                analysisApp: true,
                useAiOcr: false,
                isPhotoAnalysis: false,
                hasReport: true,
                isDel: false,
                isAi: false,
                aiTypes: aiConfig,
                useDefaultTemp: appJson?.useDefaultTemp ?? true,
                useKeyword: appJson?.useKeyword ?? false,
                useDocVerify: [
                    appJson?.useDocVerify ?? false,
                    appJson?.usePdfOcr ?? false
                ],
                tokenAppList: []
            }
        });
        dispatch({
            type: 'checkingList/setInfo',
            payload: [{
                caseId: next.caseId,
                deviceId: next._id,
                curinfo: '开始解析数据',
                curprogress: 0,
                category: ParseCategory.Quick
            }]
        });
    });
}
