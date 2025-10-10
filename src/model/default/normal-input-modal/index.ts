
import { Model } from 'dva';
import reducers from './reducers';
import { BeforeFetchStatus } from '@/schema/before-fetch-status';
import { DeviceType } from '@/schema/device-type';

/**
 * 标准采集框
 */
interface NormalInputModalState {

    open: boolean,
    /**
     * 设备
     */
    device: DeviceType,
    /**
     * 允许采集
     */
    fetchAllow: BeforeFetchStatus,
    /**
     * 消息
     */
    info: string
}

let model: Model = {
    namespace: 'normalInputModal',
    state: {
        open: false,
        device: undefined,
        fetchAllow: BeforeFetchStatus.Unverified,
        info: ''
    },
    reducers
};

export { NormalInputModalState };
export default model;