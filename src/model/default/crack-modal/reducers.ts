import { AnyAction } from 'redux';
import { CrackModalState } from ".";

export default {
    /**
     * 设置设备列表 
     * @param {Dev[]} payload 设备列表
     */
    setDev(state: CrackModalState, { payload }: AnyAction) {
        state.dev = payload;
        return state;
    },
    /**
     * 设置破解消息(追加)
     * @param {string} payload
     */
    setMessage(state: CrackModalState, { payload }: AnyAction) {
        state.message.unshift(payload);
        return state;
    },
    /**
     * 清空消息
     */
    clearMessage(state: CrackModalState) {
        state.message = [];
        return state;
    }
}