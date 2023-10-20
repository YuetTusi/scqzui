import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { send } from '@/utils/tcp-server';
import { CommandType, SocketType } from '@/schema/command';

export default {
    /**
     * 查询设备列表
     */
    *queryDev({ }: AnyAction, { fork, put }: EffectsCommandMap) {
        yield put({ type: 'setDev', payload: [] });
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.AndroidAuthQuery
        });
    },
    /**
     * 提权
     * @param {string} payload.id 所选设备value
     */
    *pick({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.AndroidAuthPick,
            msg: payload
        });
    },
    /**
     * 关闭弹框
     * 通知Fetch清理数据
     */
    *closeAndroidAuth({ }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.AndroidAuthClose,
            msg: ''
        });
    }
}