import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import DeviceType from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import { getDb } from '@/utils/db';
import log from '@/utils/log';

export default {

    /**
     * 查询设备数据
     * @param {string} payload.deviceId 设备id
     */
    *queryDev({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const { deviceId } = payload;
        const db = getDb<DeviceType>(TableName.Devices);
        try {
            const next: DeviceType = yield call([db, 'findOne'], { _id: deviceId });
            if (next) {
                yield put({ type: 'appendDevice', payload: next });
            }
        } catch (error) {
            log.error(`查询设备失败 @model/default/parsing-list/*queryDev:${error.message}`);
        }
    }
};