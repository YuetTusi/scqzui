import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import { TableName } from '@/schema/table-name';
import { SelfUnit } from '@/schema/self-unit';
import { message } from 'antd';
import { helper } from '@/utils/helper';

export default {

    *query({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const db = getDb<SelfUnit>(TableName.SelfUnit);
        const { pageIndex, pageSize, condition } = payload;
        yield put({ type: 'setLoading', payload: true });
        try {
            const [data, total]: [SelfUnit[], number] = yield all([
                call([db, 'findByPage'], { unitName: { $regex: new RegExp(condition.unitName) } }, pageIndex, pageSize, 'createdAt', -1),
                call([db, 'count'], { unitName: { $regex: new RegExp(condition.unitName) } })
            ]);
            yield put({ type: 'setPage', payload: { pageIndex, pageSize, total } });
            yield put({ type: 'setData', payload: data });
        } catch (error) {
            log.error(`查询自定义单位失败 @model/default/self-unit/*query:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    *update({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { _id, unitName } = payload as SelfUnit;
        const db = getDb<SelfUnit>(TableName.SelfUnit);
        try {
            const count: number = yield call([db, 'update'], { _id }, { $set: { unitName } });
            message.destroy();
            if (count > 0) {
                message.success('保存成功');
                yield put({ type: 'query', payload: { pageIndex: 1, pageSize: helper.PAGE_SIZE, condition: {} } });
            } else {
                message.warn('保存失败');
            }
        } catch (error) {
            message.error('保存失败');
            log.error(`更新自定义单位失败 @model/default/self-unit/*update:${error.message}`);
        }
    },
    /**
     * 保存
     */
    *save({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<SelfUnit>(TableName.SelfUnit);
        message.destroy();
        try {
            yield call([db, 'insert'], payload);
            message.success('保存成功');
            yield put({ type: 'query', payload: { pageIndex: 1, pageSize: helper.PAGE_SIZE, condition: {} } });
        } catch (error) {
            message.error('保存失败');
            log.error(`保存自定义单位失败 @model/default/self-unit/*save:${error.message}`);
        }
    },
    /**
     * 删除
     * @param {string} payload 删除id
     */
    *del({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<SelfUnit>(TableName.SelfUnit);
        message.destroy();
        try {
            const count: number = yield call([db, 'remove'], { _id: payload });
            if (count > 0) {
                message.success('删除成功');
                yield put({ type: 'query', payload: { pageIndex: 1, pageSize: helper.PAGE_SIZE, condition: {} } });
            } else {
                message.warn('删除失败');
            }
        } catch (error) {
            message.error('删除失败');
            log.error(`删除自定义单位失败 @model/default/self-unit/*del:${error.message}`);
        }
    }
};