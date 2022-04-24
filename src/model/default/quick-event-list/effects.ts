import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';

export default {

    /**
     * 点验案件查询
     */
    *query({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const db = getDb<QuickEvent>(TableName.QuickEvent);
        const { pageIndex, pageSize = helper.PAGE_SIZE } = payload;

        yield put({ type: 'setLoading', payload: true });
        try {
            const [data, total]: [QuickEvent[], number] = yield all([
                call([db, 'findByPage'], {}, pageIndex, pageSize, 'createdAt', -1),
                call([db, 'count'], {})
            ]);
            yield put({ type: 'setData', payload: data });
            yield put({
                type: 'setPage', payload: {
                    pageIndex,
                    pageSize,
                    total
                }
            });
        } catch (error) {
            console.warn(error);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};
