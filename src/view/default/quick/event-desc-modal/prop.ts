export interface EventDescModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 案件id
     */
    id: string,
    /**
     * IP地址
     */
    ip: string,
    /**
     * 取消handle
     */
    cancelHandle: () => void
};

/**
 * 下载浏览器框
 */
export interface DownloadBrowserProp {

    /**
     * 显示
     */
    open: boolean,
    /**
     * IP地址
     */
    ip: string,
    /**
     * 取消handle
     */
    cancelHandle: () => void
};