
import { Model } from 'dva';
import { GuangZhouCase } from '@/schema/platform/guangzhou-case';
import { Officer } from '@/schema/officer';
import { AppCategory } from '@/schema/app-config';
import reducers from './reducers';
import effects from './effects';
import subscriptions from './subscriptions';

interface AppSetStore {
    /**
     * 接收平台案件数据
     */
    sendCase: GuangZhouCase | null,
    /**
     * 接收警综采集人员
     */
    sendOfficer: Officer[],
    /**
     * 全局警告消息，无消息为空数组
     */
    // alertMessage: AlarmMessageInfo[],
    alertMessage: any[], //legacy:待还原类型
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
        sendCase: null,
        sendOfficer: [],
        alertMessage: [],
        cloudAppData: []
    },
    reducers,
    effects,
    subscriptions
};

export { AppSetStore };
export default model;