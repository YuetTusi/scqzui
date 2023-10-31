
/**
 * 导出报告类型
 */
export enum ExportType {
    /**
     * PDF格式
     */
    PDF = 'pdf',
    /**
     * Word文档
     */
    Word = 'docx',
    /**
     * Excel表格
     */
    Excel = 'xlsx'
}

export interface FormValue {
    /**
     * 导出格式
     */
    suffix: ExportType
    /**
     * 存储位置
     */
    saveAt: string
}

export interface ExportFullReportModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 取消
     */
    onCancel: () => void,
    /**
     * 确定
     * @param type 导出格式
     */
    onOk: (values: FormValue) => void
}