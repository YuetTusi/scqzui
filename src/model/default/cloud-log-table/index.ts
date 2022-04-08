import { Model } from "dva";
import { helper } from "@/utils/helper";
import { CloudLog } from "@/schema/cloud-log";
import reducers from './reducers';
import effects from './effects';


interface CloudLogTableState {
    /**
     * 表格数据
     */
    data: CloudLog[];
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
    namespace: 'cloudLogTable',
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

export { CloudLogTableState };
export default model;