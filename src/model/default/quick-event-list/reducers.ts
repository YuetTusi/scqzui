import { AnyAction } from 'redux';
import { QuickEventListState } from '.';

export default {

    setData(state: QuickEventListState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    setPage(state: QuickEventListState, { payload }: AnyAction) {
        state.pageIndex = payload.pageIndex;
        state.pageSize = payload.pageSize
        state.total = payload.total;
        return state;
    },
    setLoading(state: QuickEventListState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
};
