import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import CaseInfo from '@/schema/case-info';

interface NormalInputModalStoreState {
    /**
     * 按件下拉数据
     */
    caseList: CaseInfo[];
}

/**
 * 采集录入框Model（标准版）
 */
let model: Model = {
    namespace: 'normalInputModal',
    effects,
    reducers,
    state: {
        caseList: []
    }
};

export { NormalInputModalStoreState };
export default model;