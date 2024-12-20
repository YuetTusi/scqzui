import { join } from 'path';
import DataStore from 'nedb';

const cwd = process.cwd();
const pool = new Map<string, Db>();

/**
 * 得到数据实例
 * @param {string} collection
 */
function getDb<T = any>(collection: string) {
    if (pool.has(collection)) {
        return pool.get(collection) as Db<T>;
    } else {
        const db = new Db<T>(collection);
        pool.set(collection, db);
        return db;
    }
}

/**
 * 封装NeDB操作
 */
class Db<T = any> {
    _instance: DataStore<any>;
    _dbpath = '';
    _collection = '';

    /**
     * 实例化NeDB
     * @param {string} collection 集合名称
     * @param {string} dbRoot 数据库目录位置
     */
    constructor(collection: string, dbRoot: string = cwd) {
        this._collection = collection;
        this._dbpath = join(dbRoot, `qzdb/${collection}.nedb`);
        this._instance = new DataStore({
            filename: this._dbpath,
            timestampData: true
        });
    }
    /**
     * 返回集合中所有文档数据
     */
    all() {
        return new Promise<T[]>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this._instance.getAllData());
                }
            });
        });
    }
    /**
     * 条件查询，查无数据返回[]
     * @param condition 条件对象（可值查询、正则、条件等）
     */
    find(condition: Record<string, any> | null | undefined, sortField = 'updatedAt', asc = 1) {
        return new Promise<T[]>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance
                    .find(condition)
                    .sort({ [sortField]: asc })
                    .exec((err, docs: T[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(docs);
                        }
                    });
            });
        });
    }
    /**
     * 条件查询返回第一条数据
     * 若查无记录则返回null
     * @param condition 查询条件
     */
    findOne(condition: Record<string, any> | null | undefined) {
        return new Promise<T>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance.findOne(condition, (err, docs) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        });
    }
    /**
     * 分页查询
     * @param {any} condition 条件
     * @param {number} pageIndex 当前页
     * @param {number} pageSize 页尺寸
     * @param {string} sortField 排序字段
     * @param {1|-1} asc 正序逆序
     */
    findByPage(
        condition: Record<string, any> | null | undefined,
        pageIndex = 1,
        pageSize = 10,
        sortField = 'updatedAt', asc = 1) {
        return new Promise<T[]>((resolve, reject) => {
            if (pageIndex < 0 || pageSize < 1) {
                reject(new Error('页号或分页尺寸有误'));
            }
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                let cursor = this._instance.find(condition);
                if (sortField) {
                    cursor = cursor.sort({ [sortField]: asc });
                }
                cursor
                    .skip((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .exec((err, docs: T[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(docs);
                        }
                    });
            });
        });
    }
    /**
     * 插入文档
     * @param {any} doc 文档对象
     * @returns {Promise<T>}
     */
    insert(doc: T | T[]) {
        return new Promise<T | T[]>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance.insert(doc, (err, document) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(document);
                    }
                });
            });
        });
    }
    /**
     * 删除集合中符合条件的记录, 返回删除的行数
     * @param {any} condition 条件
     * @param {boolean} multi 是否删除多条
     * @returns {Promise<number>}
     */
    remove(condition: Record<string, any> | null | undefined, multi = false): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance.remove(condition, { multi }, (err, numRemoved) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(numRemoved);
                    }
                });
            });
        });
    }
    /**
     * 更新文档, 返回更新的行数
     * @param {Record<string, any> | null | undefined} condition 条件
     * @param {any} newDoc 新对象
     * @param {boolean} multi 是否批量
     * @returns {Promise<number>} 更新行数
     */
    update(condition: Record<string, any> | null | undefined, newDoc: any, multi = false) {
        return new Promise<number>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance.update(condition, newDoc, { multi }, (err, numReplaced) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(numReplaced);
                    }
                });
            });
        });
    }
    /**
     * 返回查询条件的结果数量
     * @param {any} condition 条件对象
     */
    count(condition: Record<string, any> | null | undefined) {
        return new Promise<number>((resolve, reject) => {
            this._instance.loadDatabase((err) => {
                if (err) {
                    reject(err);
                }
                this._instance.count(condition, (err, size) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(size);
                    }
                });
            });
        });
    }
    /**
     * 查询条件是否是空
     * #当查询条件的所有属性都是null或undefined时返回true
     * @param {any} condition 条件对象
     */
    static isEmptyCondition(condition: Record<string, any> | null | undefined) {
        if (condition === undefined || condition === null) {
            return true;
        }
        let undefinedCount = 0;
        for (let attr in condition) {
            if (condition[attr] === undefined || condition[attr] === null) {
                undefinedCount++;
            }
        }
        return undefinedCount === Object.keys(condition).length;
    }
}

export { Db, getDb };

