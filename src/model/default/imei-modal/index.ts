import { Model } from 'dva';
import reducers from './reducers';

/**
 * 帮助弹框
 */
interface IMEIModalState {
    /**
     * 打开
     */
    open: boolean,
}

let model: Model = {
    namespace: 'imeiModal',
    state: {
        open: false
    },
    reducers
};

export { IMEIModalState };
export default model;