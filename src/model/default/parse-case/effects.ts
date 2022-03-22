
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import CaseInfo from '@/schema/case-info';
import { TableName } from '@/schema/table-name';

export default {

    /**
     * 查询案件
     */
    *queryCase({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const { pageIndex, pageSize, condition } = payload;
        const db = getDb<CaseInfo>(TableName.Case);

        yield put({ type: 'setLoading', payload: true });
        try {
            const [next, total]: [CaseInfo[], number] = yield all([
                call([db, 'findByPage'], condition, pageIndex, pageSize, 'createdAt', -1),
                call([db, 'count'], condition)
            ]);
            yield put({ type: 'setPage', payload: { pageIndex, pageSize, total } });
            yield put({ type: 'setData', payload: next });
        } catch (error) {
            log.error(`查询案件列表失败 @model/default/parse-case/*queryCase:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};