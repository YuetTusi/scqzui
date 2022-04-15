
/**
 * 属性
 */
export interface CrackModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 破解类型
     */
    type: CrackTypes;
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
    id: string
}

/**
 * 破解方式
 */
export enum CrackTypes {
    /**
     * vivo应用锁
     */
    VivoAppLock,
    /**
     * oppo应用锁
     */
    OppoAppLock,
    /**
     * oppo隐私锁
     */
    OppoMoveLock
}

/**
 * 操作类型
 */
export enum UserAction {
    /**
     * 破解
     */
    Crack,
    /**
     * 恢复
     */
    Recover
}