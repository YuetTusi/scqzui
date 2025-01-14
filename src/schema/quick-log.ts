import { BaseEntity } from "./base-entity";


/**
 * 快取日志
 */
class QuickLog extends BaseEntity {

    /**
     * 案件名称
     */
    public caseName?: string;
    /**
     * 案件id
     */
    public caseId?: string;
    /**
     * 设备id
     */
    public deviceId?: string;
    /**
     * 手机名称
     */
    public mobileName?: string;
    /**
     * 手机编号
     */
    public mobileNo?: string;
    /**
     * 持有人
     */
    public mobileHolder?: string;
    /**
     * 存储位置
     */
    public phonePath?: string;
    /**
     * 采集时间
     */
    public fetchTime?: Date;

    constructor() {
        super();
    }
}

export { QuickLog };