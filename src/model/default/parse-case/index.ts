import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import CaseInfo from '@/schema/case-info';
import { helper } from '@/utils/helper';

interface ParseCaseState {
    /**
     * 案件数据
     */
    data: CaseInfo[],
    /**
     * 读取中
     */
    loading: boolean,
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
     * 选中的行key
     */
    selectedRowKeys: Array<string | number>
};

/**
 * 解析案件列表
 */
let model: Model = {
    namespace: 'parseCase',
    state: {
        data: [],
        loading: false,
        total: 0,
        pageIndex: 1,
        pageSize: helper.PAGE_SIZE,
        selectedRowKeys: []
    },
    reducers,
    effects
};

export { ParseCaseState };
export default model;