
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
    casePath?: string
}

export interface PredictJson {
    /**
     * AI项
     */
    config: Predict[],
    /**
     * 相似度
     */
    similarity: number
}

/**
 * 兼容旧版本predict.json类型
 * 在添加相似度配置前，此JSON是一个Array类型，现是对象
 */
export type PredictComp = PredictJson | Predict[];