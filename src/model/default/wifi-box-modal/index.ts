import { Model } from 'dva';
import reducers from './reducers';

/**
 * 仓库数据
 */
interface WifiBoxModalState {
    open: boolean;
}

let model: Model = {
    namespace: 'wifiBoxModal',
    state: {
        open: false
    },
    reducers
};

export { WifiBoxModalState };
export default model;