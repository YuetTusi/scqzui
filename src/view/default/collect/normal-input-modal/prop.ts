import FetchData from '@/schema/fetch-data';
import DeviceType from '@/schema/device-type';

export interface Prop {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 当前手机设备数据
     */
    device?: DeviceType;
    /**
     * 保存回调
     */
    saveHandle?: (arg0: FetchData) => void;
    /**
     * 取消回调
     */
    cancelHandle?: () => void;
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
}