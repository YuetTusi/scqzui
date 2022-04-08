import { Model } from 'dva';
import { CloudAppMessages } from '@/schema/cloud-app-messages';
import reducers from './reducers';

interface CloudLogModalState {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 当前云取应用
     */
    cloudApps: CloudAppMessages[]
}

let model: Model = {
    namespace: 'cloudLogModal',
    state: {
        visible: false,
        cloudApps: []
    },
    reducers
};

export { CloudLogModalState };
export default model;