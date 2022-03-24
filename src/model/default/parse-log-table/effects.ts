import dayjs from 'dayjs';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { Db, getDb } from '@/utils/db';
import logger from '@/utils/log';
import ParseLog from '@/schema/parse-log';
import { TableName } from '@/schema/table-name';
import { DelLogType } from '@/schema/del-log-type';

export default {
    /**
    * 查询解析日志
    */
    *queryParseLog({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const db = getDb<ParseLog>(TableName.ParseLog);
        const { condition, current, pageSize } = payload;

        let q: any = {};
        if (Db.isEmptyCondition(condition)) {
            q = {};
        } else {
            if (!helper.isNullOrUndefined(condition?.start)) {
                q = {
                    endTime: {
                        ...q?.endTime,
                        $gte: condition?.start.toDate()
                    }
                };
            }
            if (!helper.isNullOrUndefined(condition?.end)) {
                q = {
                    endTime: {
                        ...q?.endTime,
                        $lte: condition?.end.toDate()
                    }
                };
            }
        }

        yield put({ type: 'setLoading', payload: true });
        try {
            let [data, total]: [ParseLog[], number] = yield all([
                call([db, 'findByPage'], q, current, pageSize, 'endTime', -1),
                call([db, 'count'], q)
            ]);
            yield put({ type: 'setData', payload: data });
            yield put({
                type: 'setPage', payload: {
                    current: payload.current,
                    pageSize: payload.pageSize,
                    total
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 根据时间删除日志
     */
    *deleteParseLogByTime({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<ParseLog>(TableName.ParseLog);
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
            yield call([db, 'remove'], {
                endTime: { $lt: time }
            }, true);
            if (time === undefined) {
                message.error('日志清理失败');
                yield put({ type: 'setLoading', payload: false });
            } else {
                message.success('日志清理成功');
                yield put({ type: 'queryParseLog', payload: { condition: {}, current: 1, pageSize: helper.PAGE_SIZE } });
            }
        } catch (error) {
            message.error('日志清理失败');
            yield put({ type: 'setLoading', payload: false });
            logger.error(`日志删除失败 @modal/default/parse-log-table/*deleteParseLogByTime: ${error.message}`);
        }
    },
    /**
     * 删除一条日志记录(管理员)
     * @param {string} payload id
     */
    *dropById({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<ParseLog>(TableName.ParseLog);
        try {
            yield call([db, 'remove'], { _id: payload });
            message.success('删除成功');
            yield put({
                type: 'queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        } catch (error) {
            message.error(`删除失败, ${error.message}`);
            logger.error(`解析日志删除失败 @modal/default/parse-log-table/*dropLogById: ${error.message}`);
        }
    },
    /**
     * 清空所有日志记录(管理员)
     */
    *dropAllLog({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<ParseLog>(TableName.ParseLog);
        try {
            yield call([db, 'remove'], {}, true);
            message.success('日志清除成功');
            yield put({
                type: 'queryParseLog', payload: {
                    condition: null,
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        } catch (error) {
            message.error(`日志清除失败, ${error.message}`);
            logger.error(`解析日志清除失败 @modal/default/parse-log-table/*dropAllLog: ${error.message}`);
        }
    }
}