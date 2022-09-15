import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { send } from '@/utils/tcp-server';
import { CommandType, SocketType } from '@/schema/command';

export default {
    /**
     * 查询破解设备列表
     */
    *queryDev({ payload }: AnyAction, { fork, put }: EffectsCommandMap) {
        yield put({ type: 'setDev', payload: [] });
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.CrackQuery
        });
    },
    /**
     * 破解设备
     * @param {string} payload.id 所选设备value
     * @param {CrackType} payload.type 方式
     */
    *startCrack({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.StartCrack,
            msg: payload
        });
    },
    /**
     * 恢复设备
     * @param {string} payload.id 所选设备value
     * @param {CrackType} payload.type 方式
     */
    *startRecover({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.StartRecover,
            msg: payload
        });
    },
    /**
     * 关闭破解弹框
     * 通知Fetch清理数据
     */
    *closeCrack({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        yield fork(send, SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.CloseCrack,
            msg: ''
        });
    }
}