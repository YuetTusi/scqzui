import { AnyAction } from 'redux';
import { CheckingListState } from '.';

export default {
    /**
     * 设置解析详情消息
     * @param {ParseDetail[]} payload n条详情
     */
    setInfo(state: CheckingListState, { payload }: AnyAction) {
        state.info = payload;
        return state;
    },
    /**
     * 设置设备数据
     * @param {DeviceType[]} payload 设备数据
     */
    setRecord(state: CheckingListState, { payload }: AnyAction) {
        state.records = payload;
        return state;
    },
    /**
     * 追加设备
     * @param {DeviceType} payload 设备数据
     */
    appendRecord(state: CheckingListState, { payload }: AnyAction) {
        state.records.push(payload);
        return state;
    },
    /**
     * 从列表中移除设备
     * @param {string} payload deviceId设备id
     */
    removeRecord(state: CheckingListState, { payload }: AnyAction) {
        state.info = state.info.filter(item => item.deviceId !== payload);
        state.records = state.records.filter(item => item._id !== payload);
        return state;
    }
};