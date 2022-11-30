
/**
 * 应用配置
 */
export interface AppJson {
    /**
     * 是否开启默认关键词模版
     */
    useDefaultTemp: boolean,
    /**
     * 是否开启关键词验证
     */
    useKeyword: boolean,
    /**
     * 是否开启文档违规分析
     */
    useDocVerify: boolean,
    /**
     * 是否开启PDF违规分析
     */
    usePdfOcr: boolean
}