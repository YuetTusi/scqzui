
import { Model } from 'dva';
import { DataMode } from '@/schema/data-mode';
import { AppCategory } from '@/schema/app-config';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import reducers from './reducers';
import effects from './effects';
import subscriptions from './subscriptions';
`                                                                                                                                                                                                                                           `

interface AppSetStore {
    /**
     * 全局读取中状态
     */
    reading: boolean,
    /**
     * 模式（标准，云取证，点验，警综）
     */
    dataMode: DataMode,
    /**
     * 全局警告消息，无消息为空数组
     */
    alertMessage: AlartMessageInfo[],
    /**
     * 云取应用数据
     */
    cloudAppData: AppCategory[]
}


/**
 * 此model用于存储UI配置数据
 */
let model: Model = {
    namespace: 'appSet',
    state: {
        reading: false,
        dataMode: DataMode.Self,
        alertMessage: [],
        cloudAppData: []
    },
    reducers,
    effects,
    subscriptions
};

export { AppSetStore };
export default model;