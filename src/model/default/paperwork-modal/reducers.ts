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
    setLoading(state: PaperworkModalState, { payload }: AnyAction) {

        state.loading = payload;
        return state;
    }
};