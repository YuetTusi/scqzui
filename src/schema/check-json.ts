interface CheckJson {
    /**
     * IP地址
     */
    ip: string,
    /**
     * 端口
     */
    port: number,
    /**
     * 用户名
     */
    username: string,
    /**
     * 口令
     */
    password: string,
    /**
     * 地址
     */
    serverPath: string,
    /**
     * 开启/关闭
     */
    isCheck: boolean
}

export { CheckJson };