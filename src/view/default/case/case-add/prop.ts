import { Dispatch, SetStateAction } from 'react';
import { FormInstance } from "antd/lib/form";
import { BaseApp } from '@/schema/base-app';

export interface CaseAddProp { }

export interface FormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<FormValue>,
    /**
     * SD卡state
     */
    sdCardState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
     * 生成报告state
     */
    hasReportState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
    * 自动解析state
    */
    autoParseState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
     * 生成BCPstate
     */
    generateBcpState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
    * BCP附件state
    */
    attachmentState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
     * 是否删除state
     */
    isDelState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
     * AI设置state
     */
    isAiState: [boolean, Dispatch<SetStateAction<boolean>>],
    /**
     * AI设置state
     */
    parseAppListState: [BaseApp[], Dispatch<SetStateAction<BaseApp[]>>],
    /**
    * AI设置state
    */
    tokenAppListState: [BaseApp[], Dispatch<SetStateAction<BaseApp[]>>]
}

/**
 * 表单数据类型
 */
export interface FormValue {
    /**
     * 案件名称
     */
    currentCaseName: string;
    /**
     * 案件存储路径
     */
    m_strCasePath: string;
    /**
     * 检验单位
     */
    checkUnitName: string;
    /**
     * 采集人员编号
     */
    officerNo: string;
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
     * 执法办案人员编号/检材持有人编号
     */
    handleOfficerNo: string;
    /**
     * 违规时段起
     */
    ruleFrom: number;
    /**
     * 违规时段止
     */
    ruleTo: number;
}