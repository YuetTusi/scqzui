export interface IssueData {
    /**
     * 错误消息
     */
    issue: string,
    /**
     * 时间
     */
    time: string,
    /**
     * 类型
     */
    type: string,
}

export interface FetchIssueModalProp {
    /**
     * 打开/关闭
     */
    open: boolean,
    /**
     * 设备路径
     */
    phonePath?: string,
    /**
     * 取消handle
     */
    onCancel: () => void
}

