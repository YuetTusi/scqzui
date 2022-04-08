import dayjs from 'dayjs';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { Db, getDb } from '@/utils/db';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { CloudLog } from '@/schema/cloud-log';
import { TableName } from '@/schema/table-name';
import { DelLogType } from '@/schema/del-log-type';

export default {

    /**
     * 云取日志查询
     * @param {any} condition 条件
     * @param {number} current 当前页
     * @param {number} pageSize 页尺寸
     */
    *query({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const db = getDb<CloudLog>(TableName.CloudLog);
        const { condition, current, pageSize = helper.PAGE_SIZE } = payload;
        let $condition: any = null;

        yield put({ type: 'setLoading', payload: true });
        try {
            if (Db.isEmptyCondition(condition)) {
                $condition = null;
            } else {
                $condition = { fetchTime: {} };
                if (!helper.isNullOrUndefined(condition.start)) {
                    $condition.fetchTime.$gte = condition.start.toDate();
                }
                if (!helper.isNullOrUndefined(condition.end)) {
                    $condition.fetchTime.$lte = condition.end.toDate()
                }
            }

            const [next, total]: [CloudLog, number] = yield all([
                call([db, 'findByPage'], $condition, current, pageSize),
                call([db, 'count'], $condition)
            ]);
            yield put({ type: 'setData', payload: next });
            yield put({
                type: 'setPage', payload: {
                    ...payload,
                    total
                }
            });
        } catch (error) {
            log.error(`查询云取日志失败，@model/default/cloud-log-table/*query:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 删除日志（时段）
     */
    *del({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const db = getDb<CloudLog>(TableName.CloudLog);
        yield put({ type: 'setLoading', payload: true });
        let time: Date | undefined;
        switch (payload) {
            case DelLogType.TwoYearsAgo:
                time = dayjs().subtract(2, 'years').toDate();
                break;
            case DelLogType.OneYearAgo:
                time = dayjs().subtract(1, 'years').toDate();
                break;
            case DelLogType.SixMonthsAgo:
                time = dayjs().subtract(6, 'months').toDate();
                break;
        }
        try {
            if (time !== undefined) {
                yield call([db, 'remove'], {
                    fetchTime: {
                        $lt: time
                    }
                }, true);
                message.success('日志清理成功');
            } else {
                message.error('日志清理失败');
            }
            yield put({ type: 'query', payload: { condition: {}, current: 1 } });
        } catch (error) {
            message.error('日志清理失败');
            yield put({ type: 'setLoading', payload: false });
            log.error(`日志删除失败 @model/default/cloud-log-table/*del: ${error.message}`);
        }
    }
};