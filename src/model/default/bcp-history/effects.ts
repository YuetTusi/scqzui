import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { TableName } from '@/schema/table-name';
import { BcpEntity } from '@/schema/bcp-entity';
import { getDb } from '@/utils/db';
import logger from '@/utils/log';

export default {

    /**
     * 按设备id查询BCP记录
     * @param {string} payload 设备deviceId
     */
    *queryBcpHistory({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<BcpEntity>(TableName.CreateBcpHistory);
        try {
            const bcpHistory: BcpEntity = yield call([db, 'findOne'], { deviceId: payload });
            yield put({ type: 'setBcpHistory', payload: bcpHistory });
        } catch (error) {
            logger.error(`查询BCP历史记录失败 @model/default/bcp-history/effects/*queryBcpHistory:${error.message}`);
            yield put({ type: 'setBcpHistory', payload: null });
        }
    },
    /**
     * 保存生成BCP历史记录
     * @param {BcpHistory} payload BcpHistory对象
     */
    *saveOrUpdateBcpHistory({ payload }: AnyAction, { call, fork }: EffectsCommandMap) {
        //note: 用设备id保存BCP生成记录，进入页面读取，自动填写相应的表单项
        const db = getDb<BcpEntity>(TableName.CreateBcpHistory);
        try {
            const bcpHistory: BcpEntity = yield call([db, 'findOne'], { deviceId: payload.deviceId });
            if (bcpHistory === null) {
                //*insert
                yield fork([db, 'insert'], payload);
            } else {
                //*update
                yield fork([db, 'update'], { deviceId: payload.deviceId }, payload);
            }
        } catch (error) {
            logger.error(`查询BCP历史记录失败 @model/default/bcp-history/effects/*saveOrUpdateBcpHistory:${error.message}`);
        }
    }
};