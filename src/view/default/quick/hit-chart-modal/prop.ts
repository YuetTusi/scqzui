import { QuickRecord } from "@/schema/quick-record";

export interface HitChartModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 点验设备
     */
    record: QuickRecord,
    /**
     * 导出handle
     */
    exportHandle: () => void,
    /**
     * 关闭handle
     */
    closeHandle: () => void
}
