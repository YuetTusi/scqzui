import { AnyAction } from 'redux';
import { ParseCaseState } from '.';

export default {

    /**
     * 设置案件数据
     */
    setData(state: ParseCaseState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 设置loading状态
     */
    setLoading(state: ParseCaseState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设置分页数据
     */
    setPage(state: ParseCaseState, { payload }: AnyAction) {
        state.pageIndex = payload.pageIndex;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    }
};