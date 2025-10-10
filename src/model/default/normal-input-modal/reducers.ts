import { AnyAction } from 'redux';
import { NormalInputModalState } from ".";

export default {
    setOpen(state: NormalInputModalState, { payload }: AnyAction) {
        state.open = payload;
        return state;
    },
    setDevice(state: NormalInputModalState, { payload }: AnyAction) {
        state.device = payload;
        return state;
    },
    setFetchAllow(state: NormalInputModalState, { payload }: AnyAction) {
        state.fetchAllow = payload;
        return state;
    },
    setInfo(state: NormalInputModalState, { payload }: AnyAction) {
        state.info = payload;
        return state;
    }
};