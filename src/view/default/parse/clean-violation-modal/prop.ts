import { DeviceType } from "@/schema/device-type";

/**
 * 清理违规数据窗口Prop
 */
export interface CleanViolationModalProp {
    /**
     * 清除
     */
    onClear: (data: DeviceType) => void,
    /**
     * 取消
     */
    onCancel: () => void,
}