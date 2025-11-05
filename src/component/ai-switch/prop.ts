import { AiOcrType } from "@/schema/case-info";

export interface Predict {
    /**
     * AI分类名称
     */
    title: string,
    /**
     * 是否开启
     */
    use: boolean,
    /**
     * 隐藏
     */
    hide: boolean,
    /**
     * 说明
     */
    tips: string,
    /**
     * 后台所需属性
     */
    type: string,
    /**
     * 后台所需属性
     */
    subtype: string[]
}

export interface AiSwitchProp {
    /**
     * 案件路径
     */
    casePath?: string,
    /**
     * 是否是有线快采
     */
    wired: boolean,
    /**
     * 列数
     */
    columnCount: number,
}

export interface PredictJson {
    /**
     * AI项
     */
    config: Predict[],
    /**
     * 相似度
     */
    similarity: number,
    /**
     * 分析类型
     */
    aiType: AiOcrType,
    /**
     * 706专用参数，当是`有线快采`案件，此参数让用户配置
     */
    isAi: boolean,
    /**
     * 显示标签
     */
    label: Record<string, string>,
    /**
     * 其他属性
     */
    [others: string]: any
}
