import Officer from "@/schema/officer";
import { FormInstance } from "antd/lib/form";

export interface OfficerProp { }

/**
 * 表单Prop
 */
export interface EditFormProp {
    /**
     * 表单实例
     */
    formRef: FormInstance<Officer>,
    /**
     * 数据
     */
    data?: Officer;
}