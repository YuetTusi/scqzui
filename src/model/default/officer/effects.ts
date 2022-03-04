import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { Db } from '@/utils/db';
import { TableName } from '@/schema/table-name';
import Officer from '@/schema/officer';

export default {
    /**
     * 查询全部检验员
     */
    *fetchOfficer({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = new Db<Officer>(TableName.Officer);
        try {
            let result: Officer[] = yield call([db, 'find'], null);
            yield put({ type: 'setOfficer', payload: [...result] });
        } catch (error) {
            console.error(`@model/Officer.ts/fetchOfficer: ${error.message}`);
        }
    },
    /**
     * 删除检验员
     * @param {string} payload 检验员ID
     */
    *delOfficer({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = new Db<Officer>(TableName.Officer);
        try {
            yield call([db, 'remove'], { _id: payload });
            yield put({ type: 'fetchOfficer' });
            message.success('删除成功');
        } catch (error) {
            console.info(`@model/Officer.ts/delOfficer: ${error.message}`);
            message.success('删除失败');
        }
    }
};