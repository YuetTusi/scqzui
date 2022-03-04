import { AnyAction } from 'redux';
import { OfficerState } from '.';

export default {
    /**
     * 更新检验员列表
     * @param {Officer[]} payload 检验员列表
     */
    setOfficer(state: OfficerState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    }
}