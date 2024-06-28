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
    setCheckedDevices(state: PaperworkModalState, { payload }: AnyAction) {

        state.checkedDevices = payload;
        return state;
    },
    setTwoFormValue(state: PaperworkModalState, { payload }: AnyAction) {
        state.twoFormValue = payload;
        return state;
    },
    setThreeFormValue(state: PaperworkModalState, { payload }: AnyAction) {
        state.threeFormValue = payload;
        return state;
    },
    setFourFormValue(state: PaperworkModalState, { payload }: AnyAction) {
        state.fourFormValue = payload;
        return state;
    },
    clearThreeFormValue(state: PaperworkModalState, { }: AnyAction) {
        state.threeFormValue = [];
        return state;
    },
    clearCheckedDevices(state: PaperworkModalState, { }: AnyAction) {
        state.checkedDevices = [];
        return state;
    },
    setLoading(state: PaperworkModalState, { payload }: AnyAction) {

        state.loading = payload;
        return state;
    },
    resetValue(state: PaperworkModalState, { payload }: AnyAction) {
        state.expandedKeys = [];
        state.checkedDevices = [];
        state.twoFormValue = {} as any;
        state.threeFormValue = [];
        state.fourFormValue = {} as any;
        state.loading = false;
        return state;
    }
};