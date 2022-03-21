import { AnyAction } from 'redux';
import { BcpHistoryState } from '.';

export default {
    /**
     * 设置BCP历史数据
     */
    setBcpHistory(state: BcpHistoryState, { payload }: AnyAction) {
        state.bcpHistory = payload;
        return state;
    }
};