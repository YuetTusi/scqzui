import { AnyAction } from 'redux';
import { ParseDevState } from '.';

export default {
    /**
     * 设置案件id
     */
    setCaseId(state: ParseDevState, { payload }: AnyAction) {
        state.caseId = payload;
        return state;
    },
    /**
     * 设置案件数据
     */
    setData(state: ParseDevState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 设置loading状态
     */
    setLoading(state: ParseDevState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设置分页数据
     */
    setPage(state: ParseDevState, { payload }: AnyAction) {
        state.pageIndex = payload.pageIndex;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    }
};