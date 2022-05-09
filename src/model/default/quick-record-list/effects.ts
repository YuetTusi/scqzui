import { mkdirSync } from 'fs';
import { join } from 'path';
import { AnyAction } from "redux";
import { EffectsCommandMap } from 'dva';
import Modal from 'antd/lib/modal';
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
    /**
     * 删除设备
     * @param {DeviceType} payload
     */
    *delRec({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { _id, phonePath } = payload as QuickRecord;
        const db = getDb<QuickRecord>(TableName.QuickRecord);
        const handle = Modal.info({
            title: '正在删除',
            content: '正在删除数据，请不要关闭应用',
            okText: '确定',
            centered: true,
            okButtonProps: {
                disabled: true
            }
        });
        try {
            let success: boolean = yield helper.delDiskFile(phonePath!);
            if (success) {
                handle.update({
                    content: '删除成功',
                    okButtonProps: { disabled: false }
                });
                //NOTE:磁盘文件删除成功后，删除设备及BCP历史记录
                yield call([db, 'remove'], { _id });
                yield put({
                    type: 'query', payload: {
                        pageIndex: 1,
                        pageSize: 5,
                        condition: null
                    }
                });
                yield put({ type: 'setExpandedRowKeys', payload: [] });
            } else {
                handle.update({
                    title: '删除失败',
                    content: '可能文件仍被占用，请稍后再试',
                    okButtonProps: { disabled: false }
                });
            }
            setTimeout(() => {
                handle.destroy();
            }, 1000);
        } catch (error) {
            log.error(`删除快速点验设备失败 @model/default/quick-record-list/*delRec: ${error.message}`);
            handle.update({
                title: '删除失败',
                content: '可能文件仍被占用，请稍后再试',
                okButtonProps: { disabled: false }
            });
            setTimeout(() => {
                handle.destroy();
            }, 1000);
        }
    },
    /**
     * 更新数据库中设备解析状态
     * @param {string} payload.id 设备id
     * @param {ParseState} payload.parseState 解析状态
     */
    *updateParseState({ payload }: AnyAction, { call, put, select }: EffectsCommandMap) {
        const { _id, parseState } = payload;
        const db = getDb<QuickRecord>(TableName.QuickRecord);
        const { pageIndex, pageSize }: QuickRecordListState = yield select((state: StateTree) => state.quickRecordList);
        try {
            yield call([db, 'update'], { _id }, { $set: { parseState } });
            yield put({
                type: 'parseLogTable/queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
            yield put({
                type: 'query', payload: {
                    pageIndex, pageSize
                }
            });
        } catch (error) {
            log.error(`更新解析状态入库失败 @model/default/quick-record-list/*updateParseState: ${error.message}`);
        }
    }
}