import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import { FormInstance } from 'antd/lib/form';
import BcpEntity from '@/schema/bcp-entity';
import CaseInfo from '@/schema/case-info';
import DeviceType from '@/schema/device-type';

export interface GenerateFormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<FormValue>,
    /**
     * 采集单位
     */
    unit: [string | undefined, string | undefined],
    /**
     * 目的检验单位
     */
    dstUnit: [string | undefined, string | undefined],
    /**
     * 案件id
     */
    caseData: CaseInfo | null,
    /**
     * 设备id
     */
    deviceData: DeviceType | null,
    /**
     * BCP历史
     */
    history: BcpEntity | null,
    /**
     * 采集单位Change
     */
    unitChangeHandle: (value: string, name: string) => void,
    /**
     * 目的检验单位Change
     */
    dstUnitChangeHandle: (value: string, name: string) => void
};

/**
 * 表单
 */
export interface FormValue {
    /**
     * 有无附件
     */
    attachment: boolean;
    /**
     * 采集单位编号
     */
    unitCode: string;
    /**
     * 目的检验单位编号
     */
    dstUnitCode: string;
    /**
     * 采集人员编号
     */
    officerNo: string;
    /**
     * 采集人员姓名
     */
    officerName: string;
    /**
     * 持有人
     */
    mobileHolder: string;
    /**
     * 检才编号(采集单位码+时间)
     */
    bcpNo1: string;
    /**
     * 检材编号（前3位）
     */
    bcpNo2: string;
    /**
     * 检材编号（后4位）
     */
    bcpNo3: string;
    /**
     * 手机号
     */
    phoneNumber: string;
    /**
     * 证件类型
     */
    credentialType: string;
    /**
     * 证件编号
     */
    credentialNo: string;
    /**
     * 证件生效日期
     */
    credentialEffectiveDate: Dayjs;
    /**
     * 证件失效日期
     */
    credentialExpireDate: Dayjs;
    /**
     * 证件签发机关
     */
    credentialOrg: string;
    /**
     * 认证头像
     */
    credentialAvatar: string;
    /**
     * 性别
     */
    gender: string;
    /**
     * 民族
     */
    nation: string;
    /**
     * 出生日期
     */
    birthday: Dayjs;
    /**
     * 住址
     */
    address: string;
    /**
     * 网安部门案件编号
     */
    securityCaseNo: string;
    /**
     * 网安部门案件类别
     */
    securityCaseType: string;
    /**
     * 网安部门案件名称
     */
    securityCaseName: string;
    /**
     * 执法办案系统案件编号
     */
    handleCaseNo: string;
    /**
     * 执法办案系统案件类别
     */
    handleCaseType: string;
    /**
     * 执法办案系统案件名称
     */
    handleCaseName: string;
    /**
     * 执法办案人员编号
     */
    handleOfficerNo: string;
}