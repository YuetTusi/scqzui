import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { CaseInfo } from "@/schema/case-info";
import { DeviceType } from "@/schema/device-type";
import { InstallApp } from "@/schema/install-app";

interface TrailState {
    /**
     * 案件
     */
    caseData: CaseInfo | null,
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
        caseData: null,
        deviceData: null,
        installData: null,
        loading: false
    },
    reducers,
    effects
};

export { TrailState };
export default model;