import DeviceType from "@/schema/device-type";

interface UMagicCodeModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * USB序号
     */
    device: DeviceType | null,
    /**
     * 关闭handle
     */
    closeHandle: () => void,
    /**
     * 确定handle
     */
    okHandle: (usb: number, code: string) => void
}

export { UMagicCodeModalProp }