import { mkdirSync } from 'fs';
import { join } from 'path';
import { AnyAction } from "redux";
import { EffectsCommandMap } from 'dva';
import message from "antd/lib/message";
import { helper } from "@/utils/helper";
import { getDb } from "@/utils/db";
import log from "@/utils/log";
import { StateTree } from "@/type/model";
import { QuickRecord } from "@/schema/quick-record";
import { TableName } from "@/schema/table-name";
import { DataMode } from '@/schema/data-mode';
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
    /**
    * 更新快速点验设备数据
    * @param {QuickRecord} payload 
    */
    *updateRec({ payload }: AnyAction, { call, fork, put, select }: EffectsCommandMap) {
        const db = getDb<QuickRecord>(TableName.QuickRecord);
        const { pageIndex, pageSize } = yield select((state: StateTree) => state.quickRecordList);

        console.log(payload);
        try {
            yield call([db, 'update'], { _id: payload._id }, {
                $set: {
                    mobileHolder: payload.mobileHolder,
                    mobileNo: payload.mobileNo,
                    note: payload.note
                }
            });
            const exist: boolean = yield helper.existFile(payload.phonePath);
            if (!exist) {
                //手机路径不存在，创建之
                mkdirSync(payload.phonePath);
            }
            //将设备信息写入Device.json
            yield fork([helper, 'writeJSONfile'], join(payload.phonePath, 'Device.json'), {
                mobileHolder: payload.mobileHolder ?? '',
                mobileNo: payload.mobileNo ?? '',
                mobileName: payload.mobileName ?? '',
                note: payload.note ?? '',
                mode: payload.mode ?? DataMode.Self
            });
            yield put({
                type: 'query', payload: {
                    pageIndex, pageSize, condition: null
                }
            });
            message.success('保存成功');
        } catch (error) {
            message.error('保存失败');
            log.error(`编辑设备数据失败 @model/default/quick-record-list/*updateRec: ${error.message}`);
        }
    },
}