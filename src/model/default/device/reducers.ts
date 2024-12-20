import { AnyAction } from 'redux';
import { helper } from '@/utils/helper';
import DeviceType from '@/schema/device-type';
import { TipType } from '@/schema/tip-type';
import { DeviceStoreState } from '.';

/**
 * Reducers
 */
export default {
    /**
     * 更新案件数据是否为空
     * @param {boolean} payload
     */
    setEmptyCase(state: DeviceStoreState, { payload }: AnyAction) {
        state.isEmptyCase = payload;
        return state;
    },
    /**
     * 覆盖设备列表
     * @param {DeviceType[]} payload
     */
    setDeviceList(state: DeviceStoreState, { payload }: AnyAction) {
        state.deviceList = payload;
        return state;
    },
    /**
     * 更新设备到列表中
     * usb序号从1开始
     * @param {DeviceType} payload 设备(DeviceType)对象
     */
    setDeviceToList(state: DeviceStoreState, { payload }: AnyAction) {
        state.deviceList[payload.usb - 1] = {
            ...state.deviceList[payload.usb - 1],
            ...payload
        };
        return state;
    },
    /**
     * 更新列表中某个设备的属性
     * usb序号从1开始
     * @param {number} payload.usb USB序号
     * @param {string} payload.name DeviceType属性名
     * @param {any} payload.value 属性值
     */
    updateProp(state: DeviceStoreState, { payload }: AnyAction) {
        const { usb, name, value } = payload as {
            usb: number, name: keyof DeviceType, value: any
        };
        state.deviceList[usb - 1][name] = value;
        return state;
    },
    /**
     * 从列表中删除设备(根据USB序号删除)
     * usb序号从1开始
     * @param payload USB序号
     */
    removeDevice(state: DeviceStoreState, { payload }: AnyAction) {

        (state.deviceList as (DeviceType | undefined)[]) = state
            .deviceList.map((item: DeviceType) => {
                if (helper.isNullOrUndefined(item)) {
                    return undefined;
                } else if (item.usb == payload) {
                    return undefined;
                } else {
                    return item;
                }
            });
        return state;
    },
    /**
     * 设置手机提示消息
     * @param {number} payload.usb USB序号（从1开始）
     * @param {TipType} payload.tipType 提示类型
     * @param {string} payload.tipTitle 消息标题
     * @param {string} payload.tipContent 内容
     * @param {GuideImage} payload.tipImage 提示图
     * @param {ReturnButton} payload.tipYesButton 是按钮
     * @param {ReturnButton} payload.tipNoButton 否按钮
     */
    setTip(state: DeviceStoreState, { payload }: AnyAction) {
        const {
            usb, tipType, tipTitle, tipContent,
            tipImage, tipYesButton, tipNoButton
        } = payload;
        state.deviceList[usb - 1].tipType = tipType;
        state.deviceList[usb - 1].tipTitle = tipTitle;
        state.deviceList[usb - 1].tipContent = tipContent;
        state.deviceList[usb - 1].tipImage = tipImage;
        state.deviceList[usb - 1].tipYesButton = tipYesButton;
        state.deviceList[usb - 1].tipNoButton = tipNoButton;
        return state;
    },
    /**
     * 清除手机提示消息
     * @param {number} payload USB序号（从1开始）
     */
    clearTip(state: DeviceStoreState, { payload }: AnyAction) {
        state.deviceList[payload - 1].tipType = TipType.Nothing;
        state.deviceList[payload - 1].tipTitle = undefined;
        state.deviceList[payload - 1].tipContent = undefined;
        state.deviceList[payload - 1].tipImage = undefined;
        state.deviceList[payload - 1].tipYesButton = undefined;
        state.deviceList[payload - 1].tipNoButton = undefined;
        return state;
    }
}