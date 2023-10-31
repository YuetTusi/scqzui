import { CaseInfo } from "@/schema/case-info";
import { DataMode } from "@/schema/data-mode";

interface DeviceTableProp {
    /**
     * 案件id
     */
    caseId: string
}

/**
 * Device.json
 */
interface DeviceJson {
    /**
     * 持有人
     */
    mobileHolder: string,
    /**
     * 手机编号
     */
    mobileNo: string,
    /**
     * 手机名称
     */
    mobileName: string,
    /**
     * 备注
     */
    note: string,
    /**
     * 模式
     */
    mode: DataMode
}

enum ColumnAction {
    Edit,
    Delete,
    Import,
    Export
}

/**
 * Case.json
 */
interface CaseJson extends CaseInfo {
    /**
     * 案件名称
     */
    caseName: string,
    /**
     * 送检单位
     */
    checkUnitName: string
}

export { DeviceTableProp, DeviceJson, CaseJson, ColumnAction };