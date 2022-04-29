export interface EventDescModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 案件id
     */
    id: string,
    /**
     * IP地址
     */
    ip: string,
    /**
     * 取消handle
     */
    cancelHandle: () => void
};