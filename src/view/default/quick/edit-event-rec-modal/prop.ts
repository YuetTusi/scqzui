import { QuickRecord } from "@/schema/quick-record";

interface EditEventRecModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 设备数据
     */
    data?: QuickRecord,
    /**
     * 保存handle
     */
    onSaveHandle: (data: QuickRecord) => void,
    /**
     * 取消handle
     */
    onCancelHandle: () => void
};

/**
 * 表单
 */
interface FormValue {
    /**
     * 持有人
     */
    mobileHolder: string,
    /**
     * 编号
     */
    mobileNo: string,
    /**
     * 备注
     */
    note: string
}

export { EditEventRecModalProp, FormValue };