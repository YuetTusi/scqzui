import { QuickRecord } from "@/schema/quick-record";

export interface RecordInfoProp {
    /**
     * 快速点验设备
     */
    data: QuickRecord,
    /**
     * 按钮Click
     * @param data 设备
     * @param fn 功能枚举
     */
    onButtonClick: (data: QuickRecord, fn: ClickType) => void
}

/**
 * 按钮类型
 */
export enum ClickType {
    /**
     * 编辑
     */
    Edit,
    /**
     * 删除
     */
    Delete
}
