import { SelfUnit } from "@/schema/self-unit";

export interface EditUnitModalProp {

    /**
     * 编辑数据
     */
    data?: SelfUnit,
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 保存handle
     */
    saveHandle: (data: SelfUnit) => void,
    /**
     * 取消handle
     */
    cancelHandle: () => void
}