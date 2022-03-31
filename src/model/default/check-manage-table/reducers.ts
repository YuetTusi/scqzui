import { AnyAction } from 'redux';
import { CheckManageTableState } from '.';

export default {

    setData(state: CheckManageTableState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    setPage(state: CheckManageTableState, { payload }: AnyAction) {
        state.current = payload.current;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    },
    setLoading(state: CheckManageTableState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
};