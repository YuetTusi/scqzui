
/**
 * 应用配置
 */
export interface AppJson {
    /**
     * 禁用Socket断线警告
     */
    disableSocketDisconnectWarn: boolean,
    /**
     * 是否开启关键词验证
     */
    useKeyword: boolean,
    /**
     * 是否开启文档验证
     */
    useDocVerify: boolean
}