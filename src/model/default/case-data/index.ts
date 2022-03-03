
import { Model } from "dva";
import reducers from './reducers';
import effects from './effects';
import { helper } from "@/utils/helper";
import { CaseInfo } from "@/schema/case-info";

/**
 * 仓库Model
 */
interface CaseDataState {
    /**
     * 总记录数
     */
    total: number;
    /**
     * 当前页
     */
    current: number;
    /**
     * 页尺寸
     */
    pageSize: number;
    /**
     * 案件数据
     */
    caseData: any[];
    /**
     * 加载中
     */
    loading: boolean;
    /**
     * 全部案件
     */
    allCaseData: CaseInfo[]
}

/**
 * 案件信息Model
 */
let model: Model = {
    namespace: 'caseData',
    state: {
        //案件表格数据
        caseData: [],
        total: 0,
        current: 1,
        pageSize: helper.PAGE_SIZE,
        loading: false,
        allCaseData: []
    },
    reducers,
    effects
}

export { CaseDataState };
export default model;
