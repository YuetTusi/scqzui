import { FormInstance } from "antd/es/form/Form"

export interface ConfFormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<FormValue>,
    /**
     * 数据
     */
    data: FormValue | null
};

/**
 * 表单
 */
export interface FormValue {
    /**
     * 是否启用
     */
    enable: boolean,
    /**
     * IP地址
     */
    ip: string,
    /**
     * 端口号
     */
    port: number,
    /**
     * 用户名
     */
    username: string,
    /**
     * 口令
     */
    password: string,
    /**
     * 上传目录
     */
    serverPath: string
}