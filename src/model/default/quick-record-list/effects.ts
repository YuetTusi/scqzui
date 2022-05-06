import { AnyAction } from "redux";
import { EffectsCommandMap } from 'dva';
import { helper } from "@/utils/helper";
import { getDb } from "@/utils/db";
import log from "@/utils/log";
import { QuickRecord } from "@/schema/quick-record";
import { TableName } from "@/schema/table-name";
import { StateTree } from "@/type/model";
import { QuickRecordListState } from ".";

export default {

    /**
     * 查询
     */
    *query({ payload }: AnyAction, { all, call, put, select }: EffectsCommandMap) {

        const db = getDb<QuickRecord>(TableName.QuickRecord);
        const { pageIndex, pageSize = helper.PAGE_SIZE } = payload;
        yield put({ type: 'setLoading', payload: true });
        try {
            const { eventId }: QuickRecordListState = yield select((state: StateTree) => state.quickRecordList);
            if (eventId) {
                const [result, total]: [QuickRecord[], number] = yield all([
                    call([db, 'findByPage'], { caseId: eventId }, pageIndex, pageSize, 'createdAt', -1),
                    call([db, 'count'], { caseId: eventId })
                ]);
                yield put({ type: 'setData', payload: result });
                yield put({
                    type: 'setPage',
                    payload: {
                        pageIndex,
                        pageSize,
                        total
                    }
                });
            } else {
                yield put({ type: 'setData', payload: [] });
                yield put({
                    type: 'setPage',
                    payload: {
                        pageIndex: 1,
                        pageSize: 5,
                        total: 0
                    }
                });
            }
        } catch (error) {
            log.error(`查询快速点验设备记录失败 @model/default/quick-record-list/*query:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
}