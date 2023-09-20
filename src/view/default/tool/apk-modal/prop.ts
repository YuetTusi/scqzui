
/**
 * 属性
 */
export interface ApkModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 关闭handle
     */
    cancelHandle: () => void;
}

/**
 * 表单
 */
export interface FormValue {
    /**
     * 设备id
     */
    phone: string,
    /**
     * 存储在
     */
    saveTo: string
}
