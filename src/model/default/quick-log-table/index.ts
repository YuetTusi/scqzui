import { Model } from "dva";
import { QuickLog } from "@/schema/quick-log";
import { helper } from "@/utils/helper";
import reducers from './reducers';
import effects from './effects';


interface QuickLogTableState {
    /**
     * 表格数据
     */
    data: QuickLog[];
    /**
     * 总记录条数
     */
    total: number;
    /**
     * 当前页
     */
    current: number;
    /**
     * 分页尺寸
     */
    pageSize: number;
    /**
     * 读取状态
     */
    loading: boolean;
}

let model: Model = {
    namespace: 'quickLogTable',
    state: {
        data: [],
        total: 0,
        current: 1,
        pageSize: helper.PAGE_SIZE,
        loading: false
    },
    reducers,
    effects
};

export { QuickLogTableState };
export default model;