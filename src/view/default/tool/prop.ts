export interface ToolProp { }

export enum ExeType {
    /**
     * 聊天记录导出
     */
    ChatDownload,
    /**
     * 通话记录导出
     */
    CallRecord,
    /**
     * 华为密码破解
     */
    HuaweiPassword
}

export type Action = { type: string, payload: boolean };

/**
 * 弹框状态
 */
export interface ModalOpenState {
    /**
     * 支付宝账单云取
     */
    alipayOrderModalVisible: boolean,
    /**
     * AI相似性
     */
    aiSimilarModalVisible: boolean,
    /**
     * 破解
     */
    crackModalVisible: boolean,
    /**
     * 小米换机
     */
    miChangeModalVisible: boolean,
    /**
     * 华为克隆
     */
    huaweiCloneModalVisible: boolean,
    /**
     * Fake
     */
    fakeImportModalVisible: boolean,
    /**
     * 屏幕截图
     */
    snapshotModalVisible: boolean,
    /**
     * 安卓apk提取
     */
    apkModalVisible: boolean,
}