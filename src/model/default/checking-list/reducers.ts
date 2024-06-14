import unionBy from 'lodash/unionBy';
import { AnyAction } from 'redux';
import { CheckingListState } from '.';
import ParseDetail from '@/schema/parse-detail';

export default {
    /**
     * 设置解析详情消息
     * @param {ParseDetail[]} payload n条详情
     */
    setInfo(state: CheckingListState, { payload }: AnyAction) {

        let next = state.info.reduce<ParseDetail[]>((acc, current) => {
            const has = (payload as ParseDetail[]).find(i => i.deviceId === current.deviceId);
            if (has) {
                acc.push({
                    ...current,
                    ...has
                });
            } else {
                acc.push(current);
            }
            return acc;
        }, []);

        state.info = next;
        return state;
    },
    /**
     * 设置解析详情消息
     * @param {ParseDetail} payload 1条详情
     */
    appendInfo(state: CheckingListState, { payload }: AnyAction) {
        state.info.push(payload);
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
        state.records = unionBy(state.records, [payload], '_id');
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