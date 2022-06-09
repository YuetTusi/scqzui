import { join } from 'path';
import { readdir } from 'fs/promises';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from "dva";
import log from "@/utils/log";
import { getDb } from '@/utils/db';
import { helper } from "@/utils/helper";
import { StateTree } from "@/type/model";
import { CaseInfo } from "@/schema/case-info";
import DeviceType from "@/schema/device-type";
import { InstallApp } from "@/schema/install-app";
import { TableName } from '@/schema/table-name';

export default {
    /**
    * 按id查询设备和案件
    * @param {string} payload  设备id
    */
    *queryDeviceAndCaseById({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const deviceDb = getDb<DeviceType>(TableName.Devices);
        const caseDb = getDb<CaseInfo>(TableName.Cases);
        try {
            const [deviceData, caseData]: [DeviceType, CaseInfo] = yield all([
                call([deviceDb, 'findOne'], { _id: payload }),
                call([caseDb, 'findOne'], { _id: payload })
            ]);
            yield put({ type: 'setDeviceData', payload: deviceData });
            yield put({ type: 'setCaseData', payload: caseData });
        } catch (error) {
            log.error(`查询案件设备记录失败 @model/default/trail/*queryDeviceAndCaseById:${error.message}`);
        }
    },
    /**
     * 读取App JSON数据
     * @param {string} payload.value 值(IMEI/OAID)
     */
    *readAppQueryJson({ payload }: AnyAction, { put, select }: EffectsCommandMap) {

        const { value } = payload;
        const { phonePath }: DeviceType = yield select((state: StateTree) => state.trail.deviceData);
        yield put({ type: 'setLoading', payload: true });
        try {
            const dir: string[] = yield readdir(join(phonePath!, 'AppQuery', value));
            if (dir.length > 0) {
                const [target] = dir.sort((m, n) => n.localeCompare(m)); //按文件名倒序，取最近的文件
                const { data }: { data: InstallApp[] } =
                    yield helper.readJSONFile(join(phonePath!, 'AppQuery', value, target));
                if (data.length === 0) {
                    yield put({ type: 'setInstallData', payload: null });
                } else {
                    yield put({ type: 'setInstallData', payload: data[0] });
                }
            } else {
                yield put({ type: 'setInstallData', payload: null });
            }
        } catch (error) {
            yield put({ type: 'setInstallData', payload: null });
            log.error(`读取应用查询记录失败(${value}.json) @model/default/trail/*readAppQueryJson:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 读取本地历史数据
     * @param {string} jsonPath JSON文件路径
     */
    *readHistoryAppJson({ payload }: AnyAction, { put }: EffectsCommandMap) {

        yield put({ type: 'setLoading', payload: true });
        try {
            const { data }: { data: InstallApp[] } =
                yield helper.readJSONFile(payload);
            if (data.length === 0) {
                yield put({ type: 'setInstallData', payload: null });
            } else {
                yield put({ type: 'setInstallData', payload: data[0] });
            }
        } catch (error) {
            yield put({ type: 'setInstallData', payload: null });
            log.error(`读取应用历史数据失败(${payload}) @model/default/trail/*readHistoryAppJson:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};