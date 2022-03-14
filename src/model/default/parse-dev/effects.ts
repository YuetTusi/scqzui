import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { TableName } from '@/schema/table-name';
import DeviceType from '@/schema/device-type';
import { Db } from '@/utils/db';
import { StateTree } from '@/type/model';

export default {

    /**
     * 查询案件下设备
     */
    *queryDev({ payload }: AnyAction, { all, call, put, select }: EffectsCommandMap) {

        const { pageIndex, pageSize, condition } = payload;
        const db = new Db<DeviceType>(TableName.Device);
        const { caseId } = yield select((state: StateTree) => state.parseDev);

        yield put({ type: 'setLoading', payload: true });
        try {
            if (caseId === undefined) {
                yield put({ type: 'setData', payload: [] });
                yield put({
                    type: 'setPage', payload: {
                        pageIndex: 1,
                        pageSize: 5,
                        total: 0
                    }
                });
            } else {
                const [data, total]: [DeviceType[], number] = yield all([
                    call([db, 'findByPage'], { ...condition, caseId }, pageIndex, pageSize, 'createdAt', -1),
                    call([db, 'count'], { ...condition, caseId })
                ]);
                yield put({ type: 'setData', payload: data });
                yield put({
                    type: 'setPage', payload: {
                        pageIndex,
                        pageSize,
                        total
                    }
                });
            }
        } catch (error) {

        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};