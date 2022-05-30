import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import subscriptions from './subscriptions';

interface OrganizationState {
    /**
     * 采集单位名称
     */
    collectUnitName?: string,
    /**
     * 采集单位编号 
     */
    collectUnitCode?: string,
    /**
     * 目的检验单位名称
     */
    dstUnitName?: string,
    /**
     * 目的采集单位编号 
     */
    dstUnitCode?: string
}

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

export { OrganizationState };
export default model;