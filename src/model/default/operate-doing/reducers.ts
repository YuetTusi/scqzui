import { AnyAction } from "redux";
import { OperateDoingState } from ".";

export default {
    /**
     * 添加正在生成报告的设备id
     * @param {string} payload 正在生成报告的deviceId
     */
    addCreatingDeviceId(state: OperateDoingState, { payload }: AnyAction) {
        const next = state.creatingDeviceId.concat([payload]);
        state.creatingDeviceId = next;
        return state;
    },
    /**
     * 设置生成报告的id(数组)
     * @param {string[]} deviceId
     */
    setCreatingDeviceId(state: OperateDoingState, { payload }: AnyAction) {
        const next = state.creatingDeviceId.concat(payload);
        state.creatingDeviceId = next;
        return state;
    },
    /**
     * 删除正在生成报告的设备id
     * @param {string} payload 生成报告完成的deviceId
     */
    removeCreatingDeviceId(state: OperateDoingState, { payload }: AnyAction) {
        state.creatingDeviceId = state.creatingDeviceId.filter(i => i !== payload);
        return state;
    },
    /**
     * 清除正在生成报告的设备id
     */
    clearCreatingDeviceId(state: OperateDoingState, { }: AnyAction) {
        state.creatingDeviceId = [];
        return state;
    },
    /**
     * 设置正在导出报告的设备id
     * @param {string[]} payload 正在导出报告的deviceId
     */
    setExportingDeviceId(state: OperateDoingState, { payload }: AnyAction) {
        state.exportingDeviceId = payload;
        return state;
    }
}