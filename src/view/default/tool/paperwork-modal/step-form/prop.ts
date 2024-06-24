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
    oneFormRef: FormInstance<StepOneFormValue>
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