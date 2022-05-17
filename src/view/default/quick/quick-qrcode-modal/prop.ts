
export interface QuickQRcodeModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * IP地址（热点/路由）
     */
    ip: string,
    /**
     * 取消
     */
    cancelHandle: () => void
}