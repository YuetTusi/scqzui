import { Model } from "dva";
import reducers from './reducers';
import effects from './effects';

interface CaseAddState {
    /**
     * 保存状态
     */
    saving: boolean
}

let model: Model = {
    namespace: "caseAdd",
    state: {
        saving: false
    },
    reducers,
    effects
}

export { CaseAddState };
export default model;