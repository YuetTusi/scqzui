import { Model } from 'dva';
import reducers from './reducers';
import { ExtractionItem } from '@/schema/extraction-item';

/**
 * 设备提取方式
 */
interface ExtractionState {
    types: ExtractionItem[]
}

let model: Model = {
    namespace: 'extraction',
    state: {
        types: []
    },
    reducers
};

export { ExtractionState };
export default model;