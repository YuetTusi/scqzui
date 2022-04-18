import { FormInstance } from 'antd/lib/form';
import { FetchData } from "@/schema/fetch-data";
import { ImportTypes } from "@/schema/import-type";


/**
 * 属性
 */
interface ImportModalProp {};

interface ImportFormProp {
    /**
     * 表单引用
     */
    formRef: FormInstance<FormValue>,
    /**
     * 导入类型
     */
    type: ImportTypes
};

/**
 * 表单对象
 */
interface FormValue extends FetchData {
    /**
     * 第三方数据路径
     */
    packagePath: string,
    /**
     * SD卡数据位置（安卓数据导入独有）
     */
    sdCardPath?: string
};

export { ImportModalProp, ImportFormProp, FormValue };