import { AnyAction } from 'redux';
import { EffectsCommandMap, routerRedux } from 'dva';
import message from 'antd/lib/message';
import { Db } from '@/utils/db';
import log from '@/utils/log';
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
            console.error(`@model/default/officer/*fetchOfficer: ${error.message}`);
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
            console.info(`@model/default/officer/*delOfficer: ${error.message}`);
            message.success('删除失败');
        }
    },
    /**
     * 添加
     * @param {payload} Officer
     */
    *insertOfficer({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = new Db<Officer>(TableName.Officer);
        try {
            yield call([db, 'insert'], payload);
            yield put(routerRedux.push('/settings/officer'));
            message.success('保存成功');
        } catch (error) {
            log.error(`添加采集人员失败 @model/default/officer/*insertOfficer:${error.message}`);
            console.warn(error);
            message.warn('保存失败');
        }
    },
    /**
     * 编辑
     * @param {payload} Officer
     */
    *editOfficer({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = new Db<Officer>(TableName.Officer);
        let count = 0;
        try {
            const prev: Officer = yield call([db, 'findOne'], { _id: payload._id });
            if (prev) {
                const next: Officer = {
                    ...prev,
                    ...payload
                };
                count = yield call([db, 'update'], { _id: payload._id }, next);
            }
            yield put(routerRedux.push('/settings/officer'));
            message.success('保存成功');
        } catch (error) {
            log.error(`编辑采集人员失败 @model/default/officer/*editOfficer:${error.message}`);
            console.warn(error);
            message.warn('保存失败');
        }
    }
};