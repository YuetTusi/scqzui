import { FormInstance } from "antd/lib/form"

export interface AlipayOrderModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 取消handle
     */
    cancelHandle: () => void,
    /**
     * 保存handle
     */
    saveHandle: (data: { savePath: string }) => void
}

export interface SaveFormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<{ savePath: string }>
}