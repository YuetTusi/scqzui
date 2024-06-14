import unionBy from 'lodash/unionBy';
import { AnyAction } from 'redux';
import { ParsingListState } from '.';
import ParseDetail from '@/schema/parse-detail';

export default {
    /**
     * 设置解析详情消息
     * @param {ParseDetail[]} payload n条详情
     */
    setInfo(state: ParsingListState, { payload }: AnyAction) {
        //为解决进度消息首次过慢
        //点`解析`后会初始化info数据
        //进度消息推送要覆盖对应的deviceId的数据
        let next = state.info.reduce<ParseDetail[]>((acc, current) => {
            const has = (payload as ParseDetail[]).find(i => i.deviceId === current.deviceId);
            if (has) {
                //覆盖初始化info的deviceId
                acc.push({
                    ...current,
                    ...has
                });
            } else {
                //直接添加
                acc.push(current);
            }
            return acc;
        }, []);

        state.info = next;
        return state;
    },
    /**
     * 追加解析详情
     * @param {ParseDetail} payload 1条详情
     */
    appendInfo(state: ParsingListState, { payload }: AnyAction) {
        state.info.push(payload);
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
        state.devices = unionBy(state.devices, [payload], '_id');
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