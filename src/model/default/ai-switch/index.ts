import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { Predict } from '@/view/default/case/ai-switch';

interface AiSwitchState {
    data: Predict[]
}

/**
 * AI配置组件Model
 */
let model: Model = {

    namespace: 'aiSwitch',
    state: {
        data: []
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;