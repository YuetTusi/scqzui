import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import Modal from 'antd/lib/modal';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { QuickRecord } from '@/schema/quick-record';

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
            log.error(`查询快速点验记录失败 @model/default/quick-event-list/*query:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 删除快速点验案件
     */
    *del({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
        const recDb = getDb<QuickRecord>(TableName.QuickRecord);

        yield put({ type: 'setLoading', payload: true });
        const modal = Modal.info({
            content: '正在删除，可能时间较长，请不要关闭程序',
            okText: '确定',
            maskClosable: false,
            centered: true,
            okButtonProps: {
                disabled: true
            }
        });
        try {
            const next: QuickEvent | null = yield eventDb.findOne({ _id: payload });
            if (next === null) {
                modal.update({
                    title: '删除失败',
                    content: '点验数据有误，请重试',
                    okButtonProps: {
                        disabled: false
                    }
                });
            } else {
                const { _id, eventName, eventPath } = next;
                let success: boolean = yield helper.delDiskFile(join(eventPath, eventName));
                if (success) {
                    yield all([
                        call([recDb, 'remove'], { caseId: _id }, true),
                        call([eventDb, 'remove'], { _id: payload })
                    ]);
                }
                modal.update({
                    title: '删除成功',
                    content: undefined,
                    okButtonProps: {
                        disabled: false
                    }
                });
                setTimeout(() => {
                    modal.destroy();
                }, 800);
                yield put({
                    type: 'query',
                    payload: { pageIndex: 1, pageSize: helper.PAGE_SIZE }
                });
            }

        } catch (error) {
            log.error(`删除快速点验记录失败 @model/default/quick-event-list/*del:${error.message}`);
            modal.update({
                title: '删除失败',
                content: '数据仍被占用，请稍后重试',
                okButtonProps: {
                    disabled: false
                }
            });
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};
