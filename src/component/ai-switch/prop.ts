
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
    similarity: number,
    /**
     * 开启图像OCR识别
     */
    ocr: boolean,
    /**
     * 显示标签
     */
    label: Record<string, string>,
    /**
     * 其他属性
     */
    [others: string]: any
}
