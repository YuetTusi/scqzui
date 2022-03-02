import DeviceType from "@/schema/device-type";

interface GuideModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 设备
     */
    device: DeviceType | null;
    /**
     * 是回调
     */
    yesHandle: (value: any, data: DeviceType) => void;
    /**
     * 否回调
     */
    noHandle: (value: any, data: DeviceType) => void;
    /**
     * 关闭回调（点右上角叉）
     */
    cancelHandle: () => void;
};

interface FooterButtonsProp {
    /**
     * 设备
     */
    device: DeviceType | null;
    /**
     * 是回调
     */
    yesHandle: (value: any, data: DeviceType) => void;
    /**
     * 否回调
     */
    noHandle: (value: any, data: DeviceType) => void;
}

export { GuideModalProp, FooterButtonsProp };