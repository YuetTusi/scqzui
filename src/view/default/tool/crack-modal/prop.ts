
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
 * 类型
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
    OppoMoveLock,
    /**
     * 截屏
     */
    Snapshot
}

/**
 * 操作方式
 */
export enum UserAction {
    /**
     * 破解
     */
    Crack,
    /**
     * 恢复
     */
    Recover,
    /**
     * 截屏
     */
    Snapshop
}