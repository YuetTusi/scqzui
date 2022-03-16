import { Model } from 'dva';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import reducers from './reducers';

interface AlartMessageState {
    /**
     * 全局警告消息，无消息为空数组
     */
    alertMessage: AlartMessageInfo[],
}

/**
 * 全局消息组件
 */
let model: Model = {
    namespace: 'alartMessage',
    state: {
        alertMessage: []
    },
    reducers
}

export { AlartMessageState };
export default model;