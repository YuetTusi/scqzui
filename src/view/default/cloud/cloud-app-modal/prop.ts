import FetchData from '@/schema/fetch-data';
import DeviceType from '@/schema/device-type';

/**
 * 属性
 */
export interface Prop {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * 保存回调
     */
    onSave: (arg0: FetchData) => void,
    /**
     * 取消回调
     */
    onCancel: () => void
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
     * 手机名称
     */
    phoneName: string;
    /**
     * 手机号
     */
    mobileNumber: string;
    /**
     * 手机编号
     */
    deviceNumber: string;
    /**
     * 手机持有人
     */
    user: string;
    /**
     * 检材持有人编号
     */
    handleOfficerNo: string;
    /**
     * 备注
     */
    note: string;
    /**
     * 超时时间
     */
    cloudTimeout: number;
    /**
     * 时间间隔
     */
    cloudTimespan: number;
    /**
     * 是否保活
     */
    isAlive: boolean;
}