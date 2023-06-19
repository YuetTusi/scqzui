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
}

export { BaseEntity };