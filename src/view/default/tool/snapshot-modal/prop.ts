export interface SnapshotModalProp {

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
    id: string,
    /**
     * 保存位置
     */
    saveTo: string,
}
