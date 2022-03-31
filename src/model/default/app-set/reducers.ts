import { AnyAction } from 'redux';
import { AppSetStore } from ".";

export default {
    /**
     * 设置全局读取状态
     */
    setReading(state: AppSetStore, { payload }: AnyAction) {
        state.reading = payload;
        return state;
    },
    /**
     * 设置模式
     * @param {DataMode} payload 模式枚举 
     */
    setDataMode(state: AppSetStore, { payload }: AnyAction) {
        state.dataMode = payload;
        return state;
    },
    /**
     * 设置警综平台数据
     * @param {SendCase | null} payload 平台数据，清空数据传null
     */
    setSendCase(state: AppSetStore, { payload }: AnyAction) {
        state.sendCase = payload;
        return state;
    },
    /**
     * 设置警综平台采集人员
     * @param {Officer} payload 采集人员对象
     */
    setSendOfficer(state: AppSetStore, { payload }: AnyAction) {
        state.sendOfficer = [payload];
        return state;
    },
    /**
     * 设置云取应用数据
     * @param {AppCategory[]} payload
     */
    setCloudAppData(state: AppSetStore, { payload }: AnyAction) {
        state.cloudAppData = payload;
        return state;
    }
};