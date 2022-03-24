import { Dayjs } from "dayjs";
import { FormInstance } from "antd/lib/form";

export interface ParseLogProp { }

export interface SearchFormProp {

    /**
     * 表单引用
     */
    formRef: FormInstance<FormValue>,
    /**
     * 查询handle
     */
    onSearchHandle: (values: FormValue) => void,
    /**
     * 删除handle
     */
    onDelHandle: () => void
}

export interface FormValue {
    /**
     * 起始时间
     */
    start: Dayjs,
    /**
     * 终止时间
     */
    end: Dayjs
}