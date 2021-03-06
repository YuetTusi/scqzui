import path from 'path';
import { execFile } from 'child_process';
import { Dispatch } from "dva";
import { ipcRenderer } from "electron";
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import logger from "@/utils/log";
import { helper } from '@/utils/helper';
import { caseStore } from "@/utils/local-store";
import { send } from '@/utils/tcp-server';
// import { inputPassword } from '@src/components/feedback';
// import { DeviceParam } from '@src/components/feedback/InputPassword/componentTypes';
// import { CaptchaMsg } from '@src/components/guide/CloudCodeModal/CloudCodeModalType';
import CommandType, { Command, SocketType } from "@/schema/command";
import DeviceType from "@/schema/device-type";
import { FetchState, ParseState } from "@/schema/device-state";
import { FetchProgress } from "@/schema/fetch-record";
import GuideImage from "@/schema/guide-image";
import TipType, { ReturnButton } from "@/schema/tip-type";
import ParseDetail from "@/schema/parse-detail";
import { ParseEnd } from "@/schema/parse-log";
import { CaseInfo } from "@/schema/case-info";
import { Officer } from '@/schema/officer';
import { TableName } from "@/schema/table-name";
import { GuangZhouCase } from '@/schema/platform/guangzhou-case';
import { HumanVerify } from '@/schema/human-verify';
import { DataMode } from '@/schema/data-mode';
import { CaptchaMsg, CloudAppMessages } from '@/schema/cloud-app-messages';
import { getDb } from '@/utils/db';
import { LoginState } from '../trace-login';
// import { LoginState } from '@/model/settings/TraceLogin';

const appPath = process.cwd();


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
            message: `终端 #${usb}「${manufacturer}」采集结束`
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
    dispatch({ type: 'device/cloudCodeModal/clearApps', payload: usb });
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
 */
export function humanVerify({ msg }: Command<{
    usb: number,
    appId: string,
    humanVerifyData: HumanVerify | null
}>, dispatch: Dispatch<any>) {

    dispatch({
        type: 'cloudCodeModal/setHumanVerifyData', payload: {
            usb: msg.usb,
            m_strID: msg.appId,
            humanVerifyData: msg.humanVerifyData
        }
    });
}

/**
 * 接收警综平台数据保存到model
 */
export function saveCaseFromPlatform({ msg }: Command<GuangZhouCase>, dispatch: Dispatch<any>) {

    if (helper.isNullOrUndefined(msg.errcode)) {
        //* 若无errcode，则说明接口访问无误
        notification.close('platformNotice');
        notification.info({
            key: 'platformNotice',
            message: '警综平台消息',
            description: `接收到案件：「${msg.CaseName}」，姓名：「${msg.OwnerName}」`,
            duration: 20
        });
        logger.info(`接收警综平台数据 @model/default/receive/listener/saveCaseFromPlatform：${JSON.stringify(msg)}`);
        const officer: Officer = {
            name: msg.OfficerName ?? '',
            no: msg.OfficerID ?? ''
        };
        dispatch({ type: 'dashboard/setSendCase', payload: msg });
        dispatch({ type: 'dashboard/setSendOfficer', payload: officer });
    } else {
        notification.error({
            message: '警综数据错误',
            description: `数据接收错误，请在警综平台重新发起推送`
        });
        dispatch({ type: 'dashboard/setSendCase', payload: null });
    }
}

/**
 * 接收警综平台数据录入采集人员
 */
export function saveOrUpdateOfficerFromPlatform({ msg }: Command<GuangZhouCase>, dispatch: Dispatch<any>) {
    const officer = new Officer({ no: msg.OfficerID, name: msg.OfficerName });
    dispatch({ type: 'device/saveOrUpdateOfficer', payload: officer });
}

/**
 * 接收手机多用户/隐私空间消息
 */
export function extraMsg({ msg }: Command<{ usb: number, content: string }>, dispatch: Dispatch<any>) {
    dispatch({ type: 'device/updateProp', payload: { usb: msg.usb, name: 'extra', value: msg.content } });
}

/**
 * 解析详情
 */
export function parseCurinfo({ msg }: Command<ParseDetail[]>, dispatch: Dispatch<any>) {
    dispatch({ type: 'parsingList/setInfo', payload: msg });
}

/**
 * 解析结束
 */
export async function parseEnd({ msg }: Command<ParseEnd>, dispatch: Dispatch<any>) {

    const caseDb = getDb<CaseInfo>(TableName.Case);
    const deviceDb = getDb<DeviceType>(TableName.Device);
    const { caseId, deviceId, isparseok, errmsg } = msg;

    console.log('解析结束：', JSON.stringify(msg));
    logger.info(`解析结束(ParseEnd): ${JSON.stringify(msg)}`);
    try {
        let [caseData, deviceData]: [CaseInfo, DeviceType] = await Promise.all([
            caseDb.findOne({ _id: caseId }),
            deviceDb.findOne({ _id: deviceId })
        ]);
        if (isparseok && caseData.generateBcp) {
            //# 解析`成功`且`是`自动生成BCP
            logger.info(`解析结束开始自动生成BCP, 手机路径：${deviceData.phonePath}`);
            const bcpExe = path.join(appPath, '../tools/BcpTools/BcpGen.exe');
            const proc = execFile(bcpExe, [deviceData.phonePath!, caseData.attachment ? '1' : '0'], {
                windowsHide: true,
                cwd: path.join(appPath, '../tools/BcpTools')
            });
            proc.once('close', () => {
                // dispatch({
                //     type: 'parseDev/queryDev', payload: {
                //         condition: null,
                //         pageIndex: 1,
                //         pageSize: 5
                //     }
                // });
            });
            proc.once('error', (err) => {
                logger.error(`生成BCP错误 @model/default/receive/listener/parseEnd: ${err.message}`);
            });
        }
        if (!isparseok && !helper.isNullOrUndefined(errmsg)) {
            Modal.error({
                title: '解析错误',
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

/**
 * 提示用户输入密码
 */
// export function backDatapass({ msg }: Command<DeviceParam>, dispatch: Dispatch<any>) {

//     inputPassword(msg, (params: any, forget: boolean, password: string) => {

//         send(SocketType.Parse, {
//             type: SocketType.Parse,
//             cmd: CommandType.ConfirmDatapass,
//             msg: {
//                 forget,
//                 password,
//                 ...params
//             }
//         });
//     });
// }

/**
 * 导入第三方数据失败
 */
// export function importErr({ msg }: Command<DeviceParam>, dispatch: Dispatch<any>) {

//     ipcRenderer.invoke('db-find-one',
//         TableName.Device, {
//         id: msg.deviceId
//     }).then((data: DeviceType) => {
//         const [mobileName] = data.mobileName!.split('_');
//         Modal.error({
//             title: `「${mobileName}」导入数据失败`,
//             content: msg.msg,
//             okText: '确定'
//         });
//     }).catch((err: Error) => {
//         Modal.error({
//             content: `第三方数据导入失败`,
//             okText: '确定'
//         });
//     });
// }

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
}