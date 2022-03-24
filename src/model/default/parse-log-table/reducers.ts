import { AnyAction } from "redux";
import { ParseLogTableState } from ".";


export default {
    setLoading(state: ParseLogTableState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    setData(state: ParseLogTableState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    setPage(state: ParseLogTableState, { payload }: AnyAction) {
        state.current = payload.current;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    }
}