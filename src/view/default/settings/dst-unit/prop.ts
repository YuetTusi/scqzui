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

export { UnitProp, UnitRecord };