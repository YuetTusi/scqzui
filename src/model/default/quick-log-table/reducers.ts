import { AnyAction } from "redux";
import { QuickLogTableState } from ".";


export default {
    /**
     * 数据
     */
    setData(state: QuickLogTableState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 分页
     * 
     */
    setPage(state: QuickLogTableState, { payload }: AnyAction) {
        state.total = payload.total;
        state.current = payload.current;
        state.pageSize = payload.pageSize;
        return state;
    },
    /**
     * 读取状态
     */
    setLoading(state: QuickLogTableState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
}