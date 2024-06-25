import { AnyAction } from 'redux';
import { PaperworkModalState } from '.';

export default {

    setCaseTree(state: PaperworkModalState, { payload }: AnyAction) {

        state.caseTree = payload;
        return state;
    },
    setExpandedKeys(state: PaperworkModalState, { payload }: AnyAction) {

        state.expandedKeys = payload;
        return state;
    },
    setCheckedHolders(state: PaperworkModalState, { payload }: AnyAction) {

        if (typeof payload === 'string') {
            state.checkedHolders.add(payload);
        } else {
            state.checkedHolders = new Set(payload);
        }
        return state;
    },
    clearCheckedHolders(state: PaperworkModalState, { payload }: AnyAction) {
        state.checkedHolders = new Set<string>();
        return state;
    },
    setLoading(state: PaperworkModalState, { payload }: AnyAction) {

        state.loading = payload;
        return state;
    }
};