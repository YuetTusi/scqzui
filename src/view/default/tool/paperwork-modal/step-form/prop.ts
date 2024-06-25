import { FormInstance } from 'antd/lib/form';

export interface StepProp {
    /**
     * 表单可见
     */
    visible: boolean,

    formRef: FormInstance<any>
}

export interface StepFormProp {

    /**
     * 步骤
     */
    step: number,
    /**
     * 第1页表单
     */
    oneFormRef: FormInstance<StepOneFormValue>,
    /**
     * 第2页表单
     */
    twoFormRef: FormInstance<StepTwoFormValue>
}

export interface StepOneFormValue {
    /**
     * 案件名称
     */
    caseName: string,
    /**
     * 案件编号
     */
    caseNo: string,
    /**
     * 报告名称
     */
    reportName: string,
    /**
     * 报告编号
     */
    reportNo: string,
    /**
     * 持有人
     */
    mobileHolder: string,
    /**
     * 保存路径
     */
    savePath: string
}

export interface StepTwoFormValue {
    /**
     * 委托信息
     */
    delegation: string,
    /**
     * 检查时间
     */
    checkFrom: string,
    /**
     * 检查时间
     */
    checkTo: string,
    /**
     * 检查人
     */
    checker: string,
    /**
     * 检查对象封存固定情况
     */
    condition: string,
    /**
     * 检查目的
     */
    purpose: string,
    /**
     * 检查依据方法
     */
    standard: string,
    /**
     * 检查设备
     */
    equipment: string
}