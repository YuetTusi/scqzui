import { Database as DataBase } from "sqlite3";

const { join } = require('path');
const { Database } = require('sqlite3').verbose();

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'];

let defaultDatabasePath: string | null = null;
if (isDev === 'development') {
	defaultDatabasePath = join(cwd, 'data/base.db');
} else {
	defaultDatabasePath = join(cwd, 'resources/data/base.db');
}

class Helper {
	private _path: string | null = null;

	constructor(dbPath: string) {
		this._path = dbPath || defaultDatabasePath;
	}
	/**
	 * 执行SQL
	 * @param {string} sql SQL语句
	 * @param {string[]} params 参数
	 * @returns {Promise<string>}
	 */
	execute(sql: string, params: string[] = []) {
		let db: DataBase | null = null;
		return new Promise((resolve, reject) => {
			db = new Database(this._path, (err: Error) => {
				if (err) {
					console.log(`打开数据库失败: ${err.message}`);
					db = null;
					reject(err);
				} else {
					db!.run(sql, params, (err) => {
						if (err) {
							reject(err);
						} else {
							resolve('success');
						}
					});
					db!.close();
				}
			});
		});
	}
	/**
	 * 执行SQL查询
	 * @param {string} sql SQL语句
	 * @param {string[]} params 参数
	 * @returns {Promise<any[]>} 结果集
	 */
	query(sql: string, params: string[] = []) {
		let db: DataBase | null = null;
		return new Promise((resolve, reject) => {
			db = new Database(this._path, (err: Error) => {
				if (err) {
					console.log(`打开数据库失败: ${err.message}`);
					db = null;
					reject(err);
				} else {
					db!.all(sql, params, (err, rows) => {
						if (err) {
							reject(err);
						} else {
							resolve(rows);
						}
					});
					db!.close();
				}
			});
		});
	}
	/**
	 * 执行SQL，查询首行数据
	 * @param {string} sql  SQL语句
	 * @param {string[]} params 参数
	 * @returns {Promise<any>}
	 */
	scalar(sql: string, params: string[] = []) {
		let db: DataBase | null = null;
		return new Promise((resolve, reject) => {
			db = new Database(this._path, (err: Error) => {
				if (err) {
					console.log(`打开数据库失败: ${err.message}`);
					db = null;
					reject(err);
				} else {
					db!.get(sql, params, (err, row) => {
						if (err) {
							reject(err);
						} else {
							resolve(row);
						}
					});
					db!.close();
				}
			});
		});
	}
}

module.exports = Helper;
