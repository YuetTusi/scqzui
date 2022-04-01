import { AnyAction } from 'redux';
import { CheckInputModalState } from '.';

export default {
    /**
     * 更新案件下拉列表
     */
    setCaseList(state: CheckInputModalState, { payload }: AnyAction) {
        state.caseList = payload;
        return state;
    }
};