enum ParseCategory {

    /**
     * 标准取证
     */
    Normal,
    /**
     * 快速点验
     */
    Quick
}

/**
 * 解析详情（单条）
 */
interface ParseDetail {
    /**
     * 案件id
     */
    caseId: string,
    /**
     * 设备id
     */
    deviceId: string,
    /**
     * 进度详情
     */
    curinfo: string,
    /**
     * 进度百分比
     */
    curprogress: number,
    /**
     * 解析详情分类
     */
    category: ParseCategory
}

export { ParseCategory, ParseDetail };
export default ParseDetail;