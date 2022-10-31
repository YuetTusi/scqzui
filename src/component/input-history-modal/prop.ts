export interface InputHistoryModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 关闭handle
     */
    closeHandle: () => void
}

export interface HistoryListProp {
    /**
     * 数据
     */
    data: string[],
    /**
     * 前缀字符
     */
    prefix: string
}