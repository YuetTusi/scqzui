import { mkdirSync } from 'fs';
import path from 'path';
import { ipcRenderer } from "electron";
import { EffectsCommandMap } from "dva";
import { AnyAction } from 'redux';
import dayjs from 'dayjs';
import { StateTree } from '@/type/model';
import logger from "@/utils/log";
import { helper } from '@/utils/helper';
import { getDb } from '@/utils/db';
import { caseStore } from "@/utils/local-store";
import UserHistory, { HistoryKeys } from "@/utils/user-history";
import { send } from "@/utils/tcp-server";
import { TableName } from "@/schema/table-name";
import { CaseInfo } from "@/schema/case-info";
import DeviceType from "@/schema/device-type";
import FetchLog from "@/schema/fetch-log";
import FetchData from "@/schema/fetch-data";
import TipType from "@/schema/tip-type";
import { FetchState, ParseState } from "@/schema/device-state";
import CommandType, { SocketType } from "@/schema/command";
import { ParseEnd } from '@/schema/parse-log';
import ParseLogEntity from '@/schema/parse-log';
import { DataMode } from '@/schema/data-mode';
import { BcpEntity } from '@/schema/bcp-entity';
import { DeviceSystem } from '@/schema/device-system';
import { AppJson } from '@/schema/app-json';
import { ParseCategory } from '@/schema/parse-detail';
import { QuickRecord } from '@/schema/quick-record';
import { QuickEvent } from '@/schema/quick-event';
import parseApps from '@/config/parse-app.yaml';
import { DeviceStoreState } from './index';
import { AppSetStore } from '../app-set';

const { caseText, fetchText } = helper.readConf()!;

/**
 * 副作用
 */
export default {
    /**
     * 查询案件数据是否为空
     */
    *queryEmptyCase({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<CaseInfo>(TableName.Case);
        try {
            let count: number = yield call([db, 'count'], null);
            yield put({ type: 'device/setEmptyCase', payload: count === 0 });
        } catch (error) {
            console.log(`查询案件非空失败 @model/dashboard/Device/effects/queryEmptyCase: ${error.message}`);
            logger.error(`查询案件非空失败 @model/default/device/*queryEmptyCase: ${error.message}`);
        }
    },
    /**
     * 保存手机数据到案件下
     * @param {string} payload.id 案件id
     * @param {DeviceType} payload.data 设备数据
     */
    *saveDeviceToCase({ payload }: AnyAction, { call }: EffectsCommandMap) {
        const db = getDb<DeviceType>(TableName.Device);
        const { data } = payload as { id: string, data: DeviceType };
        try {
            yield call([db, 'insert'], {
                _id: data._id,
                caseId: data.caseId,
                checker: data.checker,
                checkerNo: data.checkerNo,
                fetchState: data.fetchState,
                parseState: data.parseState,
                fetchTime: data.fetchTime,
                fetchType: data.fetchType,
                manufacturer: data.manufacturer,
                mobileHolder: data.mobileHolder,
                mobileName: data.mobileName,
                mobileNo: data.mobileNo,
                mobileNumber: data.mobileNumber,
                mode: data.mode ?? DataMode.Self,
                cloudAppList: data.cloudAppList ?? [],
                model: data.model,
                handleOfficerNo: data.handleOfficerNo ?? '',
                note: data.note,
                parseTime: data.parseTime,
                phonePath: data.phonePath,
                serial: data.serial,
                system: data.system ?? DeviceSystem.Android
            });
        } catch (error) {
            logger.error(`设备数据入库失败 @model/default/device/*saveDeviceToCase: ${error.message}`);
        }
    },
    /**
     * 手机连入时检测状态
     * # 当一部设备正在`采集中`时若有手机再次device_in或device_out
     * # 要将数据库中解析状态改为`采集异常`
     * @param {number} payload.usb USB序号
     */
    *checkWhenDeviceIn({ payload }: AnyAction, { put, select }: EffectsCommandMap) {
        const { usb }: { usb: number } = payload;
        const state: DeviceStoreState = yield select((state: StateTree) => state.device);
        const current = state.deviceList[usb - 1]; //当前手机
        if (current?.fetchState === FetchState.Fetching && !helper.isNullOrUndefinedOrEmptyString(current._id)) {
            yield put({
                type: 'parseDev/updateParseState', payload: {
                    id: current._id,
                    parseState: ParseState.Exception
                }
            });
        }
    },
    /**
     * 更新数据库中设备解析状态
     * @param {string} payload.id 设备id
     * @param {ParseState} payload.parseState 解析状态
     */
    *updateParseState({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { id, parseState } = payload;
        const db = getDb<DeviceType>(TableName.Device);
        try {
            yield call([db, 'update'], { id }, { $set: { parseState } });
            yield put({
                type: 'parseLogTable/queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: 10
                }
            });
        } catch (error) {
            logger.error(`更新解析状态入库失败 @model/default/device/*updateParseState: ${(error as any).message}`);
        }
    },
    /**
     * 保存采集日志
     * @param {number} payload.usb USB序号
     * @param {FetchState} payload.state 采集结果（是有错还是成功）
     */
    *saveFetchLog({ payload }: AnyAction, { select }: EffectsCommandMap) {
        const { usb, state } = payload as { usb: number, state: FetchState };
        let device: DeviceStoreState = yield select((state: StateTree) => state.device);
        let current = device.deviceList[usb - 1]; //当前采集完毕的手机
        let { caseName, spareName } = caseStore.get(usb);
        let log = new FetchLog();
        log.caseName = helper.isNullOrUndefinedOrEmptyString(spareName) ? caseName.split('_')[0] : spareName;
        log.fetchTime = new Date();
        log.mobileHolder = current.mobileHolder;
        log.mobileName = current.mobileName;
        log.mobileNo = current.mobileNo;
        log.note = current.note;
        log.state = state;
        //Log数据发送到主进程，传给fetchRecordWindow中进行入库处理
        ipcRenderer.send('fetch-finish', usb, log);
    },
    /**
     * 保存解析日志
     * @param {ParseEnd} payload 采集结束后ParseEnd数据
     */
    *saveParseLog({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const deviceDb = getDb<DeviceType>(TableName.Device);
        const caseDb = getDb<CaseInfo>(TableName.Case);
        const parseLogDb = getDb<ParseLogEntity>(TableName.ParseLog);
        const {
            caseId, deviceId, isparseok, parseapps, u64parsestarttime, u64parseendtime
        } = (payload as ParseEnd);
        try {
            let [deviceData, caseData]: [DeviceType, CaseInfo] = yield all([
                call([deviceDb, 'findOne'], { _id: deviceId }),
                call([caseDb, 'findOne'], { _id: caseId })
            ]);
            let entity = new ParseLogEntity();
            entity.caseName = helper.isNullOrUndefinedOrEmptyString(caseData.spareName) ? caseData.m_strCaseName.split('_')[0] : caseData.spareName;
            entity.mobileName = deviceData?.mobileName ?? '';
            entity.mobileNo = deviceData?.mobileNo ?? '';
            entity.mobileHolder = deviceData?.mobileHolder ?? '';
            entity.note = deviceData?.note;
            entity.state = isparseok ? ParseState.Finished : ParseState.Error;
            entity.apps = parseapps;
            entity.startTime = u64parsestarttime === -1 ? undefined : new Date(dayjs.unix(u64parsestarttime).valueOf());
            entity.endTime = u64parseendtime === -1 ? undefined : new Date(dayjs.unix(u64parseendtime).valueOf());
            yield call([parseLogDb, 'insert'], entity);
            yield put({
                type: 'parseLogTable/queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        } catch (error) {
            console.log(`解析日志保存失败 @model/default/device/*saveParseLog: ${error.message}`);
            logger.error(`解析日志保存失败 @model/default/device/*saveParseLog: ${error.message}`);
        }
    },
    /**
     * 保存快速点验日志
     * @param {ParseEnd} payload 采集结束后ParseEnd数据
     */
    *saveQuickLog({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const recDb = getDb<QuickRecord>(TableName.QuickRecord);
        const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
        const parseLogDb = getDb<ParseLogEntity>(TableName.ParseLog);
        const {
            caseId, deviceId, isparseok, parseapps, u64parsestarttime, u64parseendtime
        } = (payload as ParseEnd);
        try {
            let [recData, eventData]: [QuickRecord, QuickEvent] = yield all([
                call([recDb, 'findOne'], { _id: deviceId }),
                call([eventDb, 'findOne'], { _id: caseId })
            ]);
            let entity = new ParseLogEntity();
            entity.caseName =
                helper.isNullOrUndefinedOrEmptyString(eventData?.eventName)
                    ? `未知名称`
                    : helper.getNameWithoutTime(eventData?.eventName);
            entity.mobileName = recData?.mobileName ?? '';
            entity.mobileNo = recData?.mobileNo ?? '';
            entity.mobileHolder = recData?.mobileHolder ?? '';
            entity.note = recData?.note;
            entity.state = isparseok ? ParseState.Finished : ParseState.Error;
            entity.apps = parseapps;
            entity.startTime = u64parsestarttime === -1 ? undefined : new Date(dayjs.unix(u64parsestarttime).valueOf());
            entity.endTime = u64parseendtime === -1 ? undefined : new Date(dayjs.unix(u64parseendtime).valueOf());
            yield call([parseLogDb, 'insert'], entity);
            yield put({
                type: 'parseLogTable/queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        } catch (error) {
            console.log(`解析日志保存失败 @model/default/device/*saveParseQuickLog: ${error.message}`);
            logger.error(`解析日志保存失败 @model/default/device/*saveParseQuickLog: ${error.message}`);
        }
    },
    /**
     * 开始采集
     * @param {DeviceType} payload.deviceData 为当前设备数据
     * @param {FetchData} payload.fetchData 为当前采集输入数据
     */
    *startFetch({ payload }: AnyAction, { call, fork, put, select }: EffectsCommandMap) {
        const db = getDb<CaseInfo>(TableName.Case);
        const { deviceData, fetchData } = payload as { deviceData: DeviceType, fetchData: FetchData };
        // *再次采集前要把采集记录清除
        ipcRenderer.send('progress-clear', deviceData.usb!);
        // *开始计时 
        ipcRenderer.send('time', deviceData.usb! - 1, true);
        // *再次采集前要把案件数据清掉
        caseStore.remove(deviceData.usb!);
        caseStore.set({
            usb: deviceData.usb!,
            caseName: fetchData.caseName!,
            spareName: fetchData.spareName ?? '',
            mobileHolder: fetchData.mobileHolder!,
            mobileNo: fetchData.mobileNo!
        });
        UserHistory.set(HistoryKeys.HISTORY_DEVICENAME, fetchData.mobileName!.split('_')[0]);
        UserHistory.set(HistoryKeys.HISTORY_DEVICEHOLDER, fetchData.mobileHolder!);
        UserHistory.set(HistoryKeys.HISTORY_DEVICENUMBER, fetchData.mobileNo!);
        UserHistory.set(HistoryKeys.HISTORY_MOBILENUMBER, fetchData.mobileNumber!);

        if (!helper.isNullOrUndefined(fetchData.mobileNo)) {
            //# 如果输入了手机编号，拼到手机名称之前
            fetchData.mobileName = fetchData.mobileNo! + fetchData.mobileName;
        }

        //拼接手机完整路径
        let phonePath = path.join(fetchData.casePath!, fetchData.caseName!,
            fetchData.mobileHolder!, fetchData.mobileName!);

        //NOTE:将设备数据入库
        let rec: DeviceType = { ...deviceData };
        rec.mobileHolder = fetchData.mobileHolder;
        rec.mobileNo = fetchData.mobileNo;
        rec.mobileNumber = fetchData.mobileNumber;
        rec.mobileName = fetchData.mobileName;
        rec.handleOfficerNo = fetchData.handleOfficerNo;
        rec.note = fetchData.note;
        rec.mode = fetchData.mode;
        rec.fetchTime = new Date(dayjs().add(deviceData.usb!, 's').valueOf());
        rec.phonePath = phonePath;
        rec._id = helper.newId();
        rec.caseId = fetchData.caseId;//所属案件id
        rec.parseState = ParseState.Fetching;
        rec.cloudAppList = fetchData.cloudAppList;

        let exist: boolean = yield call([helper, 'existFile'], rec.phonePath);
        if (!exist) {
            //手机路径不存在，创建之
            mkdirSync(rec.phonePath, { recursive: true });
        }
        //将设备信息写入Device.json
        yield fork([helper, 'writeJSONfile'], path.join(rec.phonePath, 'Device.json'), {
            mobileHolder: rec.mobileHolder ?? '',
            mobileNo: rec.mobileNo ?? '',
            mobileName: rec.mobileName ?? '',
            note: rec.note ?? '',
            mode: rec.mode ?? DataMode.Self
        });

        try {
            const caseData: CaseInfo = yield call([db, 'findOne'], { _id: fetchData.caseId });
            const bcp = new BcpEntity();
            const {
                collectUnitCode, collectUnitName, dstUnitCode, dstUnitName
            } = yield select((state: StateTree) => state.organization);
            bcp.mobilePath = phonePath;
            bcp.attachment = caseData.attachment;
            bcp.checkUnitName = caseData.m_strCheckUnitName ?? '';
            bcp.unitNo = collectUnitCode ?? '';
            bcp.unitName = collectUnitName ?? '';
            bcp.dstUnitNo = dstUnitCode ?? '';
            bcp.dstUnitName = dstUnitName ?? '';
            bcp.officerNo = caseData.officerNo;
            bcp.officerName = caseData.officerName;
            bcp.mobileHolder = fetchData.mobileHolder!;
            bcp.remark = fetchData.note ?? '';
            bcp.bcpNo = '';
            bcp.phoneNumber = '';
            bcp.credentialType = '0';
            bcp.credentialNo = '';
            bcp.credentialEffectiveDate = '';
            bcp.credentialExpireDate = '';
            bcp.credentialOrg = '';
            bcp.credentialAvatar = '';
            bcp.gender = '0';
            bcp.nation = '00';
            bcp.birthday = '';
            bcp.address = '';
            bcp.securityCaseNo = caseData.securityCaseNo ?? '';
            bcp.securityCaseType = caseData.securityCaseType ?? '';
            bcp.securityCaseName = caseData.securityCaseName ?? '';
            bcp.handleCaseNo = caseData.handleCaseNo ?? '';
            bcp.handleCaseType = caseData.handleCaseType ?? '';
            bcp.handleCaseName = caseData.handleCaseName ?? '';
            bcp.handleOfficerNo = fetchData.handleOfficerNo ?? '';
            yield fork([helper, 'writeBcpJson'], phonePath, bcp);
        } catch (error) {
            logger.error(`Bcp.json写入失败 @model/default/device/*startFetch: ${error.message}`);
        } finally {
            if (fetchData.mode === DataMode.GuangZhou) {
                //* 写完Bcp.json清理平台案件，下一次取证前没有推送则不允许采集
                yield put({ type: 'dashboard/setSendCase', payload: null });
            }
        }

        yield put({
            type: 'saveDeviceToCase', payload: {
                id: fetchData.caseId,
                data: rec
            }
        });

        //采集时把必要的数据更新到deviceList中
        yield put({
            type: 'setDeviceToList', payload: {
                _id: rec._id,
                usb: deviceData.usb,
                tipType: TipType.Nothing,
                fetchPercent: 0,
                fetchState: FetchState.Fetching,
                parseState: ParseState.NotParse,
                manufacturer: deviceData.manufacturer,
                model: deviceData.model,
                system: deviceData.system,
                mobileName: fetchData.mobileName,
                mobileNo: fetchData.mobileNo,
                mobileNumber: fetchData.mobileNumber ?? '',
                mobileHolder: fetchData.mobileHolder,
                note: fetchData.note,
                isStopping: false,
                caseId: fetchData.caseId,
                serial: fetchData.serial,
                mode: fetchData.mode,
                phonePath,
                cloudAppList: fetchData.cloudAppList ?? []
            }
        });

        //# 通知fetch开始采集
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.StartFetch,
            msg: {
                usb: deviceData.usb,
                mode: fetchData.mode,
                caseName: fetchData.caseName,
                casePath: fetchData.casePath,
                appList: fetchData.appList,
                cloudAppList: fetchData.cloudAppList,
                mobileName: fetchData.mobileName,
                mobileNo: fetchData.mobileNo,
                mobileHolder: fetchData.mobileHolder,
                mobileNumber: fetchData.mobileNumber ?? '',
                note: fetchData.note,
                credential: fetchData.credential,
                unitName: fetchData.unitName,
                sdCard: fetchData.sdCard ?? false,
                hasReport: fetchData.hasReport ?? false,
                isAuto: fetchData.isAuto,
                serial: fetchData.serial,
                cloudTimeout: fetchData.cloudTimeout ?? helper.CLOUD_TIMEOUT,
                cloudTimespan: fetchData.cloudTimespan ?? helper.CLOUD_TIMESPAN,
                isAlive: fetchData.isAlive ?? helper.IS_ALIVE
            }
        });

        logger.info(`开始采集(StartFetch)：${JSON.stringify({
            usb: deviceData.usb,
            mode: fetchData.mode,
            caseName: fetchData.caseName,
            casePath: fetchData.casePath,
            appList: fetchData.appList,
            cloudAppList: fetchData.cloudAppList,
            mobileName: fetchData.mobileName,
            mobileNo: fetchData.mobileNo,
            mobileHolder: fetchData.mobileHolder,
            mobileNumber: fetchData.mobileNumber ?? '',
            note: fetchData.note,
            credential: fetchData.credential,
            unitName: fetchData.unitName,
            sdCard: fetchData.sdCard ?? false,
            hasReport: fetchData.hasReport ?? false,
            isAuto: fetchData.isAuto,
            serial: fetchData.serial,
            cloudTimeout: fetchData.cloudTimeout ?? helper.CLOUD_TIMEOUT,
            cloudTimespan: fetchData.cloudTimespan ?? helper.CLOUD_TIMESPAN,
            isAlive: fetchData.isAlive ?? helper.IS_ALIVE
        })}`);
    },
    /**
     * 开始解析
     * @param {number} payload USB序号
     */
    *startParse({ payload }: AnyAction, { select, call, fork, put }: EffectsCommandMap) {

        const db = getDb<CaseInfo>(TableName.Case);
        const device: DeviceStoreState = yield select((state: StateTree) => state.device);
        const current = device.deviceList.find((item) => item?.usb == payload);

        try {
            const caseData: CaseInfo = yield call([db, 'findOne'], { _id: current?.caseId });
            if (current && caseData.m_bIsAutoParse) {
                const appConfig: AppJson = yield call([helper, 'readAppJson']);
                const tokenAppList: string[] = caseData.tokenAppList ? caseData.tokenAppList.map(i => i.m_strID) : [];

                logger.info(`开始解析(StartParse):${JSON.stringify({
                    caseId: caseData._id,
                    deviceId: current._id,
                    category: ParseCategory.Normal,
                    phonePath: current.phonePath,
                    dataMode: current.mode ?? DataMode.Self,
                    hasReport: caseData.hasReport ?? false,
                    isDel: caseData.isDel ?? false,
                    isAi: caseData.isAi ?? false,
                    aiTypes: [
                        caseData.aiThumbnail ? 1 : 0,
                        caseData.aiDoc ? 1 : 0,
                        caseData.aiDrug ? 1 : 0,
                        caseData.aiMoney ? 1 : 0,
                        caseData.aiNude ? 1 : 0,
                        caseData.aiWeapon ? 1 : 0,
                        caseData.aiDress ? 1 : 0,
                        caseData.aiTransport ? 1 : 0,
                        caseData.aiCredential ? 1 : 0,
                        caseData.aiTransfer ? 1 : 0,
                        caseData.aiScreenshot ? 1 : 0
                    ],
                    useDefaultTemp: appConfig?.useDefaultTemp ?? true,
                    useKeyword: appConfig?.useKeyword ?? false,
                    useDocVerify: appConfig?.useDocVerify ?? false,
                    tokenAppList
                })}`);
                //# 通知parse开始解析
                yield fork(send, SocketType.Parse, {
                    type: SocketType.Parse,
                    cmd: CommandType.StartParse,
                    msg: {
                        caseId: caseData._id,
                        deviceId: current._id,
                        category: ParseCategory.Normal,
                        phonePath: current.phonePath,
                        dataMode: current.mode ?? DataMode.Self,
                        hasReport: caseData.hasReport ?? false,
                        isDel: caseData.isDel ?? false,
                        isAi: caseData.isAi ?? false,
                        aiTypes: [
                            caseData.aiThumbnail ? 1 : 0,
                            caseData.aiDoc ? 1 : 0,
                            caseData.aiDrug ? 1 : 0,
                            caseData.aiMoney ? 1 : 0,
                            caseData.aiNude ? 1 : 0,
                            caseData.aiWeapon ? 1 : 0,
                            caseData.aiDress ? 1 : 0,
                            caseData.aiTransport ? 1 : 0,
                            caseData.aiCredential ? 1 : 0,
                            caseData.aiTransfer ? 1 : 0,
                            caseData.aiScreenshot ? 1 : 0
                        ],
                        useDefaultTemp: appConfig?.useDefaultTemp ?? true,
                        useKeyword: appConfig?.useKeyword ?? false,
                        useDocVerify: appConfig?.useDocVerify ?? false,
                        tokenAppList
                    }
                });

                //# 更新数据记录为`解析中`状态
                yield put({
                    type: 'parseDev/updateParseState', payload: {
                        id: current._id,
                        parseState: ParseState.Parsing
                    }
                });
            } else {
                //# 非自动解析案件，把解析状态更新为`未解析`
                yield put({
                    type: 'parseDev/updateParseState', payload: {
                        id: current!._id,
                        parseState: ParseState.NotParse
                    }
                });
            }
        } catch (error) {
            logger.error(`开始解析失败 @model/default/device/*startParse: ${error.message}`);
        }
    }
};