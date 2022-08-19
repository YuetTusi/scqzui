import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { Predict } from '@/view/default/case/ai-switch';

interface AiSwitchState {
    data: Predict[],
    similarity: number
}



/**
 * AI配置组件Model
 */
let model: Model = {

    namespace: 'aiSwitch',
    state: {
        data: [],
        similarity: 0
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;