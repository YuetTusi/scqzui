export interface ExportCondition {
    /**
     * 报告源路径
     */
    reportRoot: string,
    /**
     * 导出路径
     */
    saveTarget: string,
    /**
     * 导出名称
     */
    reportName: string,
    /**
     * 是否带附件
     */
    isAttach: boolean,
    /**
     * 是否压缩
     */
    isZip: boolean
}

export interface TreeParam {
    /**
     * tree.json文件内容
     */
    tree: string,
    /**
     * 数据文件列表
     */
    files: string[],
    /**
     * 附件文件列表
     */
    attaches: string[]
}

export type BatchExportTask = ExportCondition & TreeParam;