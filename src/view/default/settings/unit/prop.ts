interface UnitProp { }

/**
 * 数据库记录
 */
interface UnitRecord {
    /**
     * 主键（自增）
     */
    PcsID: number,
    /**
     *  单位名称
     */
    PcsName: string,
    /**
     * 单位编号
     */
    PcsCode: string
}

/**
 * 清除类型
 */
enum ClearKey {
    /**
     * 采集单位
     */
    Collect,
    /**
     * 目的检验单位
     */
    Dst
}

export { UnitProp, UnitRecord, ClearKey };