import { AnyAction } from "redux";
import { QuickRecordListState } from ".";

export default {

    setEventId(state: QuickRecordListState, { payload }: AnyAction) {
        state.eventId = payload;
        return state;
    },
    /**
     * 设置分页数据
     */
    setPage(state: QuickRecordListState, { payload }: AnyAction) {
        state.pageIndex = payload.pageIndex;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    },
    /**
     * 设置表格数据
     */
    setData(state: QuickRecordListState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 设置读取中
     */
    setLoading(state: QuickRecordListState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设置展开行key
     */
    setExpandedRowKeys(state: QuickRecordListState, { payload }: AnyAction) {
        state.expandedRowKeys = payload;
        return state;
    }
}