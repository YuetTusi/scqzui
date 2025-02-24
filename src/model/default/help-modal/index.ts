import { Model } from 'dva';
import reducers from './reducers';

/**
 * 帮助弹框
 */
interface HelpModalState {
    /**
     * 打开
     */
    open: boolean,
    /**
     * 厂商
     */
    manufacturer: string
}

let model: Model = {
    namespace: 'helpModal',
    state: {
        open: false,
        manufacturer: ''
    },
    reducers
};

export { HelpModalState };
export default model;