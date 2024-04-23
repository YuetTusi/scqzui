import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { TableName } from '@/schema/table-name';
import { TraceUser } from '@/schema/trace-user';
import { CommandType, SocketType } from '@/schema/command';
import logger from '@/utils/log';
import { send } from '@/utils/tcp-server';
import { helper } from '@/utils/helper';
import { getDb } from '@/utils/db';

const { Trace } = SocketType;

export default {
    /**
     * 读取用户记录并发送登录命令
     */
    *loadUserToLogin({ }: AnyAction, { call, put }: EffectsCommandMap) {

        const db = getDb<TraceUser>(TableName.TraceUser);

        try {
            const user: TraceUser[] = yield call([db, 'find'], null);
            if (user.length === 0) {
                return;
            }

            let { username, password, remember } = user[0];

            if (remember) {
                //有用户记录且是状态为true
                logger.info(`自动登录查询账户, 用户名:${username}`);
                yield put({ type: 'setUser', payload: { username, password } });
                yield call(send, Trace, {
                    type: Trace,
                    cmd: CommandType.TraceLogin,
                    msg: {
                        username,
                        password: helper.base64ToString(password)
                    }
                });
            }
        } catch (error) {
            logger.error(`@model/default/trace-login/*loadUserToLogin: ${error.message}`);
        }
    },
    /**
     * 查询登录用户
     */
    *queryUser({ }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<TraceUser>(TableName.TraceUser);
        try {
            const user: TraceUser[] = yield call([db, 'find'], null);
            if (user.length > 0) {
                let { username, password, remember } = user[0];
                yield put({ type: 'setUser', payload: { username, password, remember } });
            }
        } catch (error) {
            logger.error(`@model/default/trace-login/*queryUser: ${error.message}`);
        }
    },
    /**
     * 保存用户
     */
    *saveUser({ payload }: AnyAction, { call }: EffectsCommandMap) {
        const db = getDb<TraceUser>(TableName.TraceUser);
        try {
            yield call([db, 'remove'], {}, true);
            yield call([db, 'insert'], payload);
        } catch (error) {
            logger.error(`@model/default/trace-login/*saveUser: ${error.message}`);
        }
    },
    /**
     * 更新保持状态
     */
    *updateRemember({ payload }: AnyAction, { call, fork }: EffectsCommandMap) {
        const db = getDb<TraceUser>(TableName.TraceUser);
        try {
            const data: TraceUser[] = yield call([db, 'all']);
            if (data.length > 0) {
                const [current] = data;
                yield fork([db, 'update'],
                    { username: current.username },
                    { ...current, remember: payload });
            }
        } catch (error) {
            logger.error(`@model/default/trace-login/*updateRemember: ${error.message}`);
        }
    },
    /**
     * 删除登录用户记录
     */
    *delUser({ }: AnyAction, { fork }: EffectsCommandMap) {
        const db = getDb<TraceUser>(TableName.TraceUser);
        try {
            yield fork([db, 'remove'], {}, true);
        } catch (error) {
            logger.error(`@model/default/trace-login/*delUser: ${error.message}`);
        }
    },
};