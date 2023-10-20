import { AnyAction } from 'redux';
import { AndroidAuthModalState } from ".";

export default {
    /**
     * 设置设备列表 
     * @param {Dev[]} payload 设备列表
     */
    setDev(state: AndroidAuthModalState, { payload }: AnyAction) {
        state.dev = payload;
        return state;
    },
    /**
     * 设置消息(追加)
     * @param {string} payload
     */
    setMessage(state: AndroidAuthModalState, { payload }: AnyAction) {
        state.message.unshift(payload);
        return state;
    },
    /**
     * 清空消息
     */
    clearMessage(state: AndroidAuthModalState) {
        state.message = [];
        return state;
    }
}