import { AnyAction } from 'redux';
import { TrailState } from ".";

export default {
    /**
     * 设置设备数据
     * @param {DeviceType} payload
     */
    setDeviceData(state: TrailState, { payload }: AnyAction) {
        state.deviceData = payload;
        return state;
    },
    /**
     * 设置应用数据
     * @param {InstallApp} payload
     */
    setInstallData(state: TrailState, { payload }: AnyAction) {
        state.installData = payload;
        return state;
    },
    /**
     * 设置读取状态
     * @param {boolean} payload
     */
    setLoading(state: TrailState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
}