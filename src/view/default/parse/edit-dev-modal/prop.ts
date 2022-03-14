import DeviceType from "@/schema/device-type";

interface EditDevModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 设备数据
     */
    data?: DeviceType,
    /**
     * 保存handle
     */
    onSaveHandle: (data: DeviceType) => void,
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

export { EditDevModalProp, FormValue };