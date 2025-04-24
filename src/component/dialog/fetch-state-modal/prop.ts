import DeviceType from "@/schema/device-type";

interface FetchStateModalProp {
    /**
     * USB序号
     */
    device: DeviceType | null,
    /**
     * 打开/关闭
     */
    open: boolean,
    /**
     * 取消Click
     */
    onCancel: () => void
}

export { FetchStateModalProp };