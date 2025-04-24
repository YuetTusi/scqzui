import { AnyAction } from 'redux';
import { FetchStateModalState } from ".";

export default {

    /**
     * 更新采集状态详情
     * @param payload.usb number
     * @param payload.items DetailItem[]
     * @param payload.summary DetailItem[]
     */
    setData(state: FetchStateModalState, { payload }: AnyAction) {
        const { usb, items, summary } = payload;
        if (state.data[usb]) {
            state.data[usb].items = items;
            state.data[usb].summary = summary;
        } else {
            state.data[usb] = { items, summary };
        }
        return state;
    },
    /**
     * 清空采集状态详情
     * @param payload number
     */
    clearData(state: FetchStateModalState, { payload }: AnyAction) {
        state.data[payload] = { summary: undefined, items: [] };
        return state;
    }
};