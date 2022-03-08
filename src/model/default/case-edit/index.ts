import CaseInfo from '@/schema/case-info';
import { Model } from 'dva';
import effects from './effects';
import reducers from './reducers';

interface CaseEditState {
    /**
     * 读取中
     */
    loading: boolean,
    /**
     * 案件数据
     */
    data: CaseInfo | null
}

/**
 * 案件编辑
 */
let model: Model = {
    namespace: 'caseEdit',
    state: {
        loading: false,
        data: null
    },
    reducers,
    effects
};

export { CaseEditState };
export default model;