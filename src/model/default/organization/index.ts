import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import subscriptions from './subscriptions';

/**
 * 采集单位&目的检验单位配置
 */
let model: Model = {

    namespace: 'organization',
    state: {
        collectUnitName: undefined,
        collectUnitCode: undefined,
        dstUnitName: undefined,
        dstUnitCode: undefined
    },
    reducers,
    effects,
    subscriptions
};

export default model;