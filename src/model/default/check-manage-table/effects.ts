import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import FetchData from '@/schema/fetch-data';
import { TableName } from '@/schema/table-name';
import { Db, getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import log from '@/utils/log';

export default {
    /**
     * 查询点验数据
     */
    *queryData({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const db = getDb<FetchData>(TableName.CheckData);
        const { current, pageSize = helper.PAGE_SIZE } = payload;
        const condition: Record<string, any> = {};
        yield put({ type: 'setLoading', payload: true });
        if (!helper.isNullOrUndefined(payload?.condition?.mobileHolder)) {
            condition.mobileHolder = { $regex: new RegExp(`${payload?.condition?.mobileHolder}`) };
        }

        try {
            let [data, total]: [FetchData[], number] = yield all([
                call([db, 'findByPage'], { ...condition }, current, pageSize, 'createdAt', -1),
                call([db, 'count'], { ...condition })
            ]);
            yield put({
                type: 'setPage', payload: {
                    current,
                    pageSize,
                    total
                }
            });
            yield put({ type: 'setData', payload: data });
        } catch (error) {
            log.error(`查询点验数据失败 @model/default/check-manage-table/*queryData ${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 更新点验数据
     */
    *updateData({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const db = getDb<FetchData>(TableName.CheckData);
        message.destroy();
        try {
            let result: number = yield call([db, 'update'], { serial: payload.serial }, payload);
            if (result !== 0) {
                yield put({
                    type: 'queryData', payload: {
                        condition: {},
                        current: 1
                    }
                });
                message.success('保存成功');
            } else {
                message.warn('保存失败');
            }
        } catch (error) {
            message.error('保存失败');
            log.error(`更新点验数据失败 @model/default/check-manage-table/*updateData ${error.message}`);
        }
    },
    /**
     * 删除点验数据
     */
    *delData({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const db = getDb<FetchData>(TableName.CheckData);
        message.destroy();
        try {
            const isEmpty = Db.isEmptyCondition(payload);
            const $condition: Record<string, any> = isEmpty ? {} : { serial: payload.serial };
            let result: number = yield call([db, 'remove'], $condition, isEmpty);
            if (result !== 0) {
                yield put({
                    type: 'queryData', payload: {
                        condition: {},
                        current: 1
                    }
                });
            }
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
            log.error(`删除点验数据失败 @model/default/check-manage-table/*delData ${error.message}`);
        }
    }
};