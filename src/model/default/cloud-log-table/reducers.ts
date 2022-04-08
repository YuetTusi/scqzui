import { AnyAction } from 'redux';
import { CloudLogTableState } from '.';

export default {

    /**
     * 设置数据
     */
    setData(state: CloudLogTableState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 设置分页
     * @param {number} payload.current 当前页
     * @param {number} payload.pageSize 页尺寸
     * @param {number} payload.total 总数
     */
    setPage(state: CloudLogTableState, { payload }: AnyAction) {
        state.current = payload.current;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    },
    /**
     * 设置读取状态
     * @param {boolean} payload.loading 读取中
     */
    setLoading(state: CloudLogTableState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
};