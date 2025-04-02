import DeviceType from "@/schema/device-type";

/**
 * 文字引导框
 */
interface LeadModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 设备
     */
    device: DeviceType | null,
    /**
     * 关闭handle
     */
    closeHandle: () => void,
    /**
     * 确定handle
     */
    okHandle: () => void
}

export { LeadModalProp }