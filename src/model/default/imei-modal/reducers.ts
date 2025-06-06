import { AnyAction } from 'redux';
import { IMEIModalState } from ".";

export default {

    /**
     * 打开窗口
     * @param payload 
     */
    setOpen(state: IMEIModalState, { payload }: AnyAction) {
        state.open = payload;
        return state;
    }
};