import DeviceType from "@/schema/device-type";
import FetchRecord from "@/schema/fetch-record";

/**
 * 属性
 */
export interface LiveModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 设备
     */
    device: DeviceType | null;
    /**
     * 标题
     */
    title?: string;
    /**
     * 取消回调
     */
    cancelHandle?: () => void;
};

export interface EventMessage {
    /**
     * 当前消息所属设备序号
     */
    usb: number;
    /**
     * 采集记录
     */
    fetchRecord: FetchRecord;
}