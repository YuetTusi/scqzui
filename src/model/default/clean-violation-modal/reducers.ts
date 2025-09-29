import { AnyAction } from 'redux';
import { CleanViolationModalState } from '.';

export default {
    /**
     * 打开窗口
     */
    setOpen(state: CleanViolationModalState, { payload }: AnyAction) {
        state.open = payload;
        return state;
    },
    /**
     * 设置loading状态
     */
    setLoading(state: CleanViolationModalState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设备
     */
    setDevice(state: CleanViolationModalState, { payload }: AnyAction) {
        state.device = payload;
        return state;
    },
    /**
     * 更新消息
     */
    setMessage(state: CleanViolationModalState, { payload }: AnyAction) {
        if (typeof payload === 'string') {
            state.message.unshift(payload);
        } else {
            state.message = [...payload, ...state.message];
        }
        return state;
    },
    /**
     * 清空消息
     */
    clearMessage(state: CleanViolationModalState) {
        state.message = [];
        return state;
    }
};