/**
 * 提取方式项
 */
export interface ExtractionItem {
    /**
     * 提取方式名称
     */
    name: string,
    /**
     * 值
     */
    value: string,
    /**
     * 是否启用此项
     */
    enable: boolean,
    /**
     * 提示内容
     */
    tip: string
}