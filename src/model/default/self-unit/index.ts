import { Model } from 'dva';
import { SelfUnit } from '@/schema/self-unit';
import { helper } from '@/utils/helper';
import reducers from './reducers';
import effects from './effects';

interface SelfUnitState {
    /**
     * 数据
     */
    data: SelfUnit[],
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
    loading: boolean,
    /**
     * 编辑数据
     */
    editData?: SelfUnit,
};

/**
 * 自定义单位
 */
let model: Model = {
    namespace: 'selfUnit',
    state: {
        data: [],
        pageIndex: 1,
        pageSize: helper.PAGE_SIZE,
        total: 0,
        loading: false,
        editData: undefined
    },
    reducers,
    effects
};

export { SelfUnitState };
export default model;
