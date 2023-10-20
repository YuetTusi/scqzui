
/**
 * 属性
 */
export interface AndroidAuthModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 关闭handle
     */
    onCancel: () => void;
}

/**
 * 表单
 */
export interface FormValue {
    /**
     * 设备id
     */
    id: string
}