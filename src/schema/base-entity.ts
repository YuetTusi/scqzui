/**
 * 数据库对象的基类
 */
abstract class BaseEntity {
    /**
     * NeDB生成的id值
     */
    public _id?: string;
    /**
     * 创建时间
     */
    public createdAt?: Date;
    /**
     * 更新时间
     */
    public updatedAt?: Date;
    /**
     * 启用
     */
    public enable?: 0 | 1;
    /**
     * 是否删除（目前用于记录删除过状态）
     */
    public del?: 0 | 1;
}

export { BaseEntity };