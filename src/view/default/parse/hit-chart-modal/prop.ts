import { DeviceType } from "@/schema/device-type";

export interface HitChartModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 设备
     */
    record: DeviceType,
    /**
     * 导出handle
     */
    exportHandle: () => void,
    /**
     * 关闭handle
     */
    closeHandle: () => void
}