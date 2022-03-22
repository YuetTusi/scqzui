

interface ExportBcpModalProp {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * 导出BCP handle
     * @param bcpList 导出BCP文件列表
     * @param destination 导出目录
     */
    okHandle: (bcpList: string[], destination: string) => void,
    /**
     * 取消handle
     */
    cancelHandle: () => void
}

export { ExportBcpModalProp }