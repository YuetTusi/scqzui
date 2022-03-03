import { DeviceType } from "@/schema/device-type";

export interface CloudHistoryModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 当前设备
     */
    device: DeviceType | null;
    /**
     * 取消handle
     */
    cancelHandle: () => void;
}
