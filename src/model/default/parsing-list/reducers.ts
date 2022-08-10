import ParseDetail from '@/schema/parse-detail';
import { AnyAction } from 'redux';
import { ParsingListState } from '.';

export default {
    /**
     * 设置解析详情消息
     * @param {ParseDetail[]} payload n条详情
     */
    setInfo(state: ParsingListState, { payload }: AnyAction) {
        state.info = payload;
        return state;
    },
    /**
     * 设置设备数据
     * @param {DeviceType[]} payload 设备数据
     */
    setDevice(state: ParsingListState, { payload }: AnyAction) {
        state.devices = payload;
        return state;
    },
    /**
     * 追加设备
     * @param {DeviceType} payload 设备数据
     */
    appendDevice(state: ParsingListState, { payload }: AnyAction) {
        const has = state.devices.some((item) => item._id === payload._id);
        if (!has) {
            state.devices.push(payload);
        }
        return state;
    },
    /**
     * 从列表中移除设备
     * @param {string} payload deviceId设备id
     */
    removeDevice(state: ParsingListState, { payload }: AnyAction) {
        state.info = state.info.filter(item => item.deviceId !== payload);
        state.devices = state.devices.filter(item => item._id !== payload);
        return state;
    }
};