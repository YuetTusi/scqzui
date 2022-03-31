import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { FetchData } from "@/schema/fetch-data";
import { helper } from '@/utils/helper';

interface CheckManageTableState {
    /**
     * 表格数据
     */
    data: FetchData[],
    /**
     * 当前页
     */
    current: number,
    /**
     * 页尺寸
     */
    pageSize: number,
    /**
     * 记录总数
     */
    total: number,
    /**
     * 加载中
     */
    loading: boolean
}

let model: Model = {
    namespace: 'checkManageTable',
    state: {
        data: [],
        current: 1,
        pageSize: helper.PAGE_SIZE,
        total: 0,
        loading: false
    },
    reducers,
    effects
}

export { CheckManageTableState };
export default model;