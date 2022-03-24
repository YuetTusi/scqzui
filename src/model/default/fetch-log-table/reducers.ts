import { AnyAction } from "redux";
import { FetchLogTableState } from ".";


export default {
    /**
     * 数据
     */
    setData(state: FetchLogTableState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 分页
     * 
     */
    setPage(state: FetchLogTableState, { payload }: AnyAction) {
        state.total = payload.total;
        state.current = payload.current;
        state.pageSize = payload.pageSize;
        return state;
    },
    /**
     * 读取状态
     */
    setLoading(state: FetchLogTableState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
}