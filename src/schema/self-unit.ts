import { BaseEntity } from "./base-entity";

/**
 * 自定义单位（部队版本使用）
 */
class SelfUnit extends BaseEntity {

    /**
    * 单位名称
    */
    unitName: string = '';
}

export { SelfUnit };