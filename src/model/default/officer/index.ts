import { Model } from 'dva';
import { Officer } from '@/schema/officer';
import reducers from './reducers';
import effects from './effects';

/**
 * 仓库数据
 */
interface OfficerState {
    data: Officer[];
}

let model: Model = {
    namespace: 'officer',
    state: {
        data: []
    },
    reducers,
    effects
};

export { OfficerState };
export default model;