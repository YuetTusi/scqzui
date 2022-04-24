import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { helper } from '@/utils/helper';
import { QuickEvent } from '@/schema/quick-event';

interface QuickEventListState {
    /**
     * 数据
     */
    data: QuickEvent[],
    /**
     * 当前页
     */
    pageIndex: number,
    /**
     * 页尺寸
     */
    pageSize: number,
    /**
     * 总数
     */
    total: number,
    /**
     * 读取中
     */
    loading: boolean
};

let model: Model = {

    namespace: 'quickEventList',
    state: {
        data: [],
        pageIndex: 1,
        pageSize: helper.PAGE_SIZE,
        total: 0,
        loading: false
    },
    reducers,
    effects
};

export { QuickEventListState };
export default model;