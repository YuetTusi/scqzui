/**
 * NeDB集合（表名）枚举
 */
enum TableName {
    /**
     * 采集日志表
     */
    FetchLog = 'fetch-log',
    /**
     * 解析日志表
     */
    ParseLog = 'parse-log',
    /**
     * 短信云取证日志表
     */
    CloudLog = 'cloud-log',
    /**
     * 案件表
     */
    Case = 'case',
    /**
     * 设备（手机）表
     */
    Device = 'device',
    /**
     * 检验员
     */
    Officer = 'officer',
    /**
     * 点验设备数据
     */
    CheckData = 'check-data',
    /**
     * BCP历史记录表
     */
    CreateBcpHistory = 'create-bcp-history',
    /**
     * 单位表（部队版本）
     */
    ArmyUnit = 'army-unit',
    /**
     * 痕迹查询用户表
     * 保存登录用户
     */
    TraceUser = 'trace-user',
    /**
     * 单位配置
     */
    Organization = 'organization'
}

export { TableName };