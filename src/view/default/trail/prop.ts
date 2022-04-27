import CaseInfo from "@/schema/case-info";
import DeviceType from "@/schema/device-type";
import { InstallApp } from "@/schema/install-app";

export interface CaseDescProp {

    /**
     * 案件数据
     */
    caseData: CaseInfo,
    /**
     * 设备数据
     */
    deviceData: DeviceType
}

export interface ButtonListProp {

    /**
     * 查询按钮
     */
    buttonList: Array<{ name: string, value: string, type: 'IMEI' | 'OAID' }>,
    /**
     * 查询
     */
    onSearch: (value: string, type: 'IMEI' | 'OAID') => void
}

export interface InstallTabProp {
    installData: InstallApp | null;
};
