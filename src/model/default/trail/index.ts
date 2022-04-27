import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { DeviceType } from "@/schema/device-type";
import { InstallApp } from "@/schema/install-app";

interface TrailState {
    /**
     * 设备
     */
    deviceData: DeviceType | null,
    /**
     * 应用数据
     */
    installData: InstallApp | null,
    /**
     * 读取中
     */
    loading: boolean
}

let model: Model = {
    namespace: 'trail',
    state: {
        deviceData: null,
        installData: null,
        loading: false
    },
    reducers,
    effects
};

export { TrailState };
export default model;