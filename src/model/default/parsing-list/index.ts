import ParseDetail from '@/schema/parse-detail';
import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import subscriptions from './subscriptions';
import DeviceType from '@/schema/device-type';

interface ParsingListState {
    /**
     * 进度消息
     * 数组中每一条对应一个设备
     * 如数组有2条表示有同时两部设备正在解析
     * 用deviceId来做区分
     */
    info: ParseDetail[],
    /**
     * 设备数据与进度数据对应
     */
    devices: DeviceType[]
}


let model: Model = {

    namespace: 'parsingList',
    state: {
        info: [],
        devices: []
    },
    reducers,
    effects,
    subscriptions
};

export { ParsingListState };
export default model;