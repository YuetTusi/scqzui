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
    twoFormRef: FormInstance<StepTwoFormValue>,
    /**
    * 第3页表单
    */
    threeFormRef: FormInstance<StepThreeFormValue>,
    /**
    * 第4页表单
    */
    fourFormRef: FormInstance<StepFourFormValue>,
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

export interface StepThreeFormValue {
    /**
     * 检材名称
     */
    mobileName: string,
    /**
     * 检材型号
     */
    model: string,
    /**
     * 持有人
     */
    mobileHolder: string,
    /**
     * IMEI
     */
    imei: string,
    /**
     * 手机号
     */
    mobileNumber: string,
    /**
     * 前面照片路径
     */
    frontPath: string,
    /**
     * 背面照片路径
     */
    backPath: string,
    /**
     * 其他
     */
    [others: string]: any
}

export interface StepFourFormValue {
    /**
     * 检查步骤
     */
    checkStep: string,
    /**
     * 结语
     */
    summary: string,
    /**
     * 附件路径列表
     */
    attachments: string[],
    /**
     * 截图路径
     */
    reportCapture: string,
    /**
     * 其他
     */
    [others: string]: any
}