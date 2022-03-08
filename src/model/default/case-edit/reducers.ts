import { AnyAction } from 'redux';
import { CaseEditState } from '.';

export default {

    /**
     * 读取中状态
     */
    setLoading(state: CaseEditState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设置案件数据
     */
    setData(state: CaseEditState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    }
};