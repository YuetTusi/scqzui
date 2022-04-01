import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { CaseInfo } from '@/schema/case-info';


interface CheckInputModalState {
    /**
     * 按件下拉数据
     */
    caseList: CaseInfo[];
}

/**
 * 采集录入框Model（点验版）
 */
let model: Model = {
    namespace: 'checkInputModal',
    effects,
    reducers,
    state: {
        caseList: []
    }
};

export { CheckInputModalState };
export default model;