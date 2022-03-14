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
    loading: boolean,
    pageIndex: number,
    pageSize: number,
    total: number
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
        pageSize: helper.PAGE_SIZE
    },
    reducers,
    effects
};

export { ParseCaseState };
export default model;