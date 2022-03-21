import { Model } from 'dva';
import { BcpEntity } from '@/schema/bcp-entity';
import reducers from './reducers';
import effects from './effects';

interface BcpHistoryState {
    /**
     * 历史记录
     */
    bcpHistory: BcpEntity | null
}

/**
 * BCP生成历史记录
 */
let model: Model = {
    namespace: 'bcpHistory',
    state: {
        bcpHistory: null
    },
    reducers,
    effects
};

export { BcpHistoryState };
export default model;