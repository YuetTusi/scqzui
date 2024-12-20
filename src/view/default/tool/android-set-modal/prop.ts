
/**
 * 属性
 */
export interface AndroidSetModalProp {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * 窗口类型
     */
    type: SetType,
    /**
     * 关闭handle
     */
    onCancel: () => void
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

export enum SetType {
    /**
     * 提权
     */
    PickAuth,
    /**
     * 解锁
     */
    Unlock
}