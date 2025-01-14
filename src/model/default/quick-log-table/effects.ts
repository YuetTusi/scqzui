import dayjs from 'dayjs';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { Db, getDb } from '@/utils/db';
import logger from '@/utils/log';
import { TableName } from '@/schema/table-name';
import { DelLogType } from '@/schema/del-log-type';
import { QuickLog } from '@/schema/quick-log';

export default {

    *save({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        const db = getDb<QuickLog>(TableName.QuickLog);
        try {
            yield fork([db, 'insert'], payload);
        } catch (error) {
            logger.error(`增加快采日志失败 @modal/default/quick-log-table/*save: ${error.message}`);
        }
    },
    /**
    * 查询采集日志数据
    * @param {any} payload.condition 条件
    * @param {number} payload.current 当前页
    * @param {number} payload.pageSize 页尺寸 
    */
    *query({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const db = getDb<QuickLog>(TableName.QuickLog);
        const { condition, current, pageSize } = payload;
        let $condition: any = null;
        if (Db.isEmptyCondition(condition)) {
            $condition = {};
        } else {
            $condition = { fetchTime: {} };
            if (!helper.isNullOrUndefined(condition?.start)) {
                $condition = {
                    fetchTime: {
                        ...$condition.fetchTime,
                        $gte: condition.start.toDate()
                    }
                };
            }
            if (!helper.isNullOrUndefined(condition?.end)) {
                $condition = {
                    fetchTime: {
                        ...$condition.fetchTime,
                        $lte: condition.end.toDate()
                    }
                };
            }
        }
        yield put({ type: 'setLoading', payload: true });
        try {
            let [data, total]: [QuickLog[], number] = yield all([
                call([db, 'findByPage'], { ...$condition, enable: { $ne: 0 } }, current, pageSize, 'fetchTime', -1),
                call([db, 'count'], { ...$condition, enable: { $ne: 0 } })
            ]);
            yield put({ type: 'setData', payload: data });
            yield put({
                type: 'setPage', payload: {
                    total,
                    current,
                    pageSize
                }
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 根据时间删除日志
     */
    *deleteByTime({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<QuickLog>(TableName.QuickLog);
        yield put({ type: 'setLoading', payload: true });
        let time: Date | undefined;
        switch (payload) {
            case DelLogType.TwoYearsAgo:
                time = new Date(dayjs().subtract(2, 'years').toDate());
                break;
            case DelLogType.OneYearAgo:
                time = new Date(dayjs().subtract(1, 'years').toDate());
                break;
            case DelLogType.SixMonthsAgo:
                time = new Date(dayjs().subtract(6, 'months').toDate());
                break;
        }
        try {
            if (time !== undefined) {
                yield call([db, 'remove'], {
                    $and: [
                        {
                            fetchTime: { $lt: time }
                        }, {
                            enable: { $ne: 0 }
                        }
                    ]

                }, true);
                message.success('日志清理成功');
            } else {
                message.error('日志清理失败');
            }
            yield put({ type: 'query', payload: { condition: {}, current: 1, pageSize: helper.PAGE_SIZE } });
        } catch (error) {
            message.error('日志清理失败');
            yield put({ type: 'setLoading', payload: false });
            logger.error(`日志删除失败 @modal/default/quick-log-table/*deleteByTime: ${error.message}`);
        }
    },
    /**
     * 清除所有日志数据
     */
    *dropAllLog({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<QuickLog>(TableName.QuickLog);
        yield put({ type: 'setLoading', payload: true });
        try {
            yield call([db, 'remove'], { enable: { $ne: 0 } }, true);
            yield put({ type: 'query', payload: { condition: { enable: { $ne: 0 } }, current: 1, pageSize: helper.PAGE_SIZE } });
            message.success('日志清除成功');
        } catch (error) {
            message.error('日志清除失败');
            logger.error(`日志清除失败 @modal/default/quick-log-table/*dropAllData: ${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
}