import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { TableName } from '@/schema/table-name';
import { QuickRecord } from '@/schema/quick-record';
import { getDb } from '@/utils/db';
import log from '@/utils/log';

export default {

    /**
     * 查询点验记录数据
     * @param {string} payload.deviceId 设备id
     */
    *queryRecord({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const { deviceId } = payload;
        const db = getDb<QuickRecord>(TableName.QuickRecord);
        try {
            const next: QuickRecord = yield call([db, 'findOne'], { _id: deviceId });
            if (next) {
                yield put({ type: 'appendRecord', payload: next });
            }
        } catch (error) {
            log.error(`查询设备失败 @model/default/checking-list/*queryRecord:${error.message}`);
        }
    }
};