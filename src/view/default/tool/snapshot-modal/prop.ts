import { CrackTypes } from "../crack-modal/prop";

export interface SnapshotModalProp {

    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 破解类型
     */
    // type: CrackTypes;
    /**
     * 关闭handle
     */
    cancelHandle: () => void;
}


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
    id: string,
    /**
     * 保存位置
     */
    saveTo: string,
}
