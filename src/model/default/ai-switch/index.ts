import { Model } from 'dva';
import { AiTypes } from '@/view/default/case/ai-switch';
import reducers from './reducers';
import effects from './effects';

interface AiSwitchState {
    data: AiTypes[]
}

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