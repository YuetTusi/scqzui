export interface NedbImportModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 导入handle
     */
    importHandle: (dbPath: string) => void,
    /**
     * 取消handle
     */
    cancelHandle: () => void,
}