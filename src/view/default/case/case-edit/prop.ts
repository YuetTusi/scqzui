import { Dispatch, SetStateAction } from "react";
import { FormInstance } from "antd/lib/form";
import { BaseApp } from "@/schema/base-app";
import CaseInfo from "@/schema/case-info";

interface CaseEditProp { }

interface FormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<CaseInfo>,
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

export { CaseEditProp, FormProp };