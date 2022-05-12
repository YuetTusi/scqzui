import { AnyAction } from 'redux';
import { SelfUnitState } from '.';

export default {
    /**
     * 设置数据
     */
    setData(state: SelfUnitState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 设置分页
     */
    setPage(state: SelfUnitState, { payload }: AnyAction) {
        state.pageIndex = payload.pageIndex;
        state.pageSize = payload.pageSize;
        state.total = payload.total;
        return state;
    },
    /**
     * 设置读取中
     */
    setLoading(state: SelfUnitState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    },
    /**
     * 设置编辑数据
     */
    setEditData(state: SelfUnitState, { payload }: AnyAction) {
        state.editData = payload;
        return state;
    }
};