import DeviceType from "@/schema/device-type";

interface DevInfoProp {
    /**
     * 设备
     */
    data: DeviceType,
    /**
     * 按钮Click
     * @param data 设备
     * @param fn 功能枚举
     */
    onButtonClick: (data: DeviceType, fn: ClickType) => void
}

/**
 * 按钮类型
 */
enum ClickType {

    /**
     * 生成BCP
     */
    GenerateBCP,
    /**
     * 导出BCP
     */
    ExportBCP,
    /**
     * 云点验
     */
    CloudSearch,
    /**
     * 编辑
     */
    Edit,
    /**
     * 删除
     */
    Delete
}

export { DevInfoProp, ClickType };