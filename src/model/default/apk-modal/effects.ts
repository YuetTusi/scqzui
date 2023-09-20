import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CommandType, SocketType } from '@/schema/command';
import { send } from '@/utils/tcp-server';

export default {
    /**
     * 查询安卓apk列表
     */
    *queryPhone({ }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.ApkPhoneQuery
        });
    },
    /**
     * 查询安卓apk列表
     * @param payload value所选设备值
     */
    *queryApk({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.ApkQuery,
            msg: payload
        });
    },
    /**
     * 开始提取apk
     * @param payload.phone 所选设备
     * @param payload.saveTo 存储在
     * @param payload.apk 所选apk
     */
    *extract({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.ApkExtract,
            msg: payload
        });
    }
};