import { DeviceType } from "@/schema/device-type";
import { FetchData } from "@/schema/fetch-data";


export interface Prop {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * 当前手机设备数据
     */
    device: DeviceType | null,
    /**
     * 保存回调
     */
    saveHandle: (arg0: FetchData) => void,
    /**
     * 取消回调
     */
    cancelHandle: () => void
};

/**
 * 表单
 */
export interface FormValue {
    /**
     * 案件
     */
    case: string;
    /**
     * 案件备用名称
     */
    spareName: string;
    /**
     * 手机名称
     */
    phoneName: string;
    /**
     * 姓名（点验版本意义为`姓名`，原为`持有人`）
     */
    user: string;
    /**
     * 设备手机号（点验版本意义为`设备手机号`，原为`备注`）
     */
    note: string;
    /**
     * 身份证/军官号
     */
    credential: string;
}