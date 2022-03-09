import { BaseEntity } from './base-entity';

/**
 * 单位设置信息
 */
class Organization extends BaseEntity {

    /**
     * 采集单位名称
     */
    public collectUnitName?: string;
    /**
     * 采集单位编号
     */
    public collectUnitCode?: string;
    /**
     * 目的检验单位名称
     */
    public dstUnitName?: string;
    /**
     * 目的检验单位编号
     */
    public dstUnitCode?: string;
}

export { Organization };
