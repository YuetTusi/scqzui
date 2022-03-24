import { Model } from "dva";
import { helper } from "@/utils/helper";
import ParseLog from "@/schema/parse-log";
import reducers from './reducers';
import effects from './effects';

interface ParseLogTableState {
    /**
     * 表格数据
     */
    data: ParseLog[];
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
    namespace: 'parseLogTable',
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

export { ParseLogTableState };
export default model;