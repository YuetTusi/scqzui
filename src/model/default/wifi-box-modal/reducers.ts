import { AnyAction } from 'redux';
import { WifiBoxModalState } from '.';

export default {
    /**
     * 打开/关闭
     */
    setOpen(state: WifiBoxModalState, { payload }: AnyAction) {
        state.open = payload;
        return state;
    }
}