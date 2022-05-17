import React from 'react';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import net from 'net';
import path from 'path';
import cpy from 'cpy';
import { v4 } from 'uuid';
import yaml from 'js-yaml';
import glob from 'glob';
import memoize from 'lodash/memoize';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import { exec, execFile, spawn, ChildProcessWithoutNullStreams } from 'child_process';
import Select from 'antd/lib/select';
import log from './log';
import { Conf } from '../type/model';
import { BcpEntity } from '../schema/bcp-entity';
import { AppCategory } from '../schema/app-config';
import { BaseApp } from '../schema/base-app';
import { TableName } from '../schema/table-name';
import { CaseInfo } from '../schema/case-info';
import { Manufaturer } from '../schema/manufaturer';
import { AppJson } from '../schema/app-json';
import { CheckJson } from '../schema/check-json';
import { QuickEvent } from '@/schema/quick-event';
import { getDb } from './db';

const cwd = process.cwd();//应用的根目录
const KEY = 'az'; //密钥
dayjs.locale('zh-cn');

//封装工具函数
const helper = {
    PAGE_SIZE: 10,
    /**
     * 空串
     */
    EMPTY_STRING: '',
    /**
     * 默认云取证超时时间
     */
    CLOUD_TIMEOUT: 3600,
    /**
     * 默认云取证时间间隔（秒）
     */
    CLOUD_TIMESPAN: 4,
    /**
     * 是否保活
     */
    IS_ALIVE: false,
    /**
     * 云取证App接口地址（配置文件中若没有地址则使用）
     */
    FETCH_CLOUD_APP_URL: 'http://139.9.112.8:9699/app',
    /**
     * 云取证AppMD5校验地址（配置文件中若没有地址则使用）
     */
    VALID_CLOUD_APP_URL: 'http://139.9.112.8:9699/md5',
    /**
     * 快速点验二维码IP名单
     */
    QUICK_QR_IP: ['192.168.137.1', '192.168.50.99', '192.168.191.1'],
    /**
     * @description 转为Moment日期格式
     * @param date 原日期字串
     * @param format 格式化字串 默认年-月-日
     * @returns Moment实例
     */
    parseDate(date: string, format: string = 'YYYY-MM-DD'): Dayjs {
        return dayjs(date, format);
    },
    /**
     * 得到当前时间戳
     * @param {number} offsetSecond 偏移量（若传入生成的时间戳加上偏移量）
     */
    timestamp(offsetSecond?: number) {
        if (offsetSecond) {
            return dayjs().add(offsetSecond, 's').format('YYYYMMDDHHmmss');
        } else {
            return dayjs().format('YYYYMMDDHHmmss');
        }
    },
    /**
     * 返回无时间戳的字串
     * @param name 原字串
     * @returns 返回无时间戳的字串
     */
    getNameWithoutTime(name: string = '') {
        if (name.includes('_')) {
            return name.split('_')[0];
        } else {
            return name;
        }
    },
    /**
     * @description 是否是null或undefined
     * @param val 任意值
     */
    isNullOrUndefined(val: any): boolean {
        if (Object.prototype.toString.call(val) === '[object Undefined]' ||
            Object.prototype.toString.call(val) === '[object Null]') {
            return true;
        } else {
            return false;
        }
    },
    /**
     * @description 是否是null或undefined或空串
     * @param val 任意值
     */
    isNullOrUndefinedOrEmptyString(val: any): boolean {
        if (Object.prototype.toString.call(val) === '[object Undefined]' ||
            Object.prototype.toString.call(val) === '[object Null]' ||
            val == '') {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 运行exe文件
     * @param filePath 文件路径
     * @param args 命令参数 
     */
    runExe(filePath: string, args: string[] = [], cwd?: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (path.extname(filePath) !== '.exe') {
                reject('非exe可执行文件');
            } else {
                execFile(filePath, args, {
                    cwd,
                    windowsHide: false
                }, (err: Error | null) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve('success');
                    }
                });
            }
        });
    },
    /**
     * 启动进程
     * @param {string} exeName exe名称
     * @param {string} exePath exe所在路径
     * @param {string[]} exeParams 参数
     */
    runProc(handle: ChildProcessWithoutNullStreams | null, exeName: string, exePath: string, exeParams: string[] = []) {
        handle = spawn(exeName, exeParams, {
            cwd: exePath
        });
        handle.once('error', () => {
            console.log(`${exeName}启动失败`);
            log.error(`${exeName}启动失败,exePath:${exePath}`);
            handle = null;
        });
    },
    /**
     * 读取配置文件
     * @param algo 解密算法（默认rc4）
     */
    readConf: memoize((algo: string = 'rc4'): Conf | null => {
        const isDev = process.env['NODE_ENV'];
        if (isDev === 'development') {
            let confPath = path.join(cwd, './src/config/ui.yaml');
            let chunk = fs.readFileSync(confPath, 'utf8');
            return yaml.load(chunk) as Conf;
        } else {
            let confPath = path.join(cwd, 'resources/config/conf');
            try {
                fs.accessSync(confPath);
                let chunk = fs.readFileSync(confPath, 'utf8');
                const decipher = crypto.createDecipher(algo, KEY);
                let conf = decipher.update(chunk, 'hex', 'utf8');
                conf += decipher.final('utf8');
                return yaml.load(conf) as Conf;
            } catch (error: any) {
                log.error(`读取配置文件失败 @utils/helper/readConf() : ${error.message}`)
                return null;
            }
        }
    }),
    /**
     * 读取JSON文件
     * @param filePath 文件路径
     */
    readJSONFile(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf8' }, (err, chunk) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(JSON.parse(chunk));
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    },
    /**
     * 写入JSON文件，原文件会覆盖
     * @param filePath 文件路径
     * @param data JSON数据
     */
    writeJSONfile(filePath: string, data: string | object | any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let json = "";
            if (typeof data === 'string') {
                json = data;
            } else {
                try {
                    json = JSON.stringify(data);
                } catch (error) {
                    reject(error);
                }
            }
            fs.writeFile(filePath, json, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    /**
     * 写Bcp.json文件
     * @param phonePath 手机路径
     * @param bcp BCP对象
     */
    writeBcpJson(phonePath: string, bcp: BcpEntity): Promise<void> {
        const target = path.join(phonePath, 'Bcp.json');
        return new Promise((resolve, reject) => {
            fs.writeFile(target, JSON.stringify({
                ...bcp,
                attachment: bcp.attachment ? '1' : '0',
                manufacturer: localStorage.getItem('manufacturer') ?? '',
                security_software_orgcode:
                    localStorage.getItem('security_software_orgcode') ?? '',
                materials_name: localStorage.getItem('materials_name') ?? '',
                materials_model: localStorage.getItem('materials_model') ?? '',
                materials_hardware_version:
                    localStorage.getItem('materials_hardware_version') ?? '',
                materials_software_version:
                    localStorage.getItem('materials_software_version') ?? '',
                materials_serial: localStorage.getItem('materials_serial') ?? '',
                ip_address: localStorage.getItem('ip_address') ?? ''
            }), { encoding: 'utf8' }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(void 0);
                }
            });
        });
    },
    /**
     * 保存Case.json文件
     * @param saveTo 存储位置
     * @param data 案件数据
     */
    writeCaseJson(saveTo: string, data: CaseInfo) {
        return this.writeJSONfile(path.join(saveTo, 'Case.json'), {
            ...data,
            caseName: helper.isNullOrUndefinedOrEmptyString(data.spareName)
                ? data.m_strCaseName
                : `${data.spareName}_${helper.timestamp()}`,
            checkUnitName: data.m_strCheckUnitName ?? ''
        });
    },
    /**
     * 读取设备软硬件信息
     */
    readManufaturer(): Promise<Manufaturer> {
        const jsonPath = process.env['NODE_ENV'] === 'development'
            ? path.join(cwd, './data/manufaturer.json')
            : path.join(cwd, './resources/config/manufaturer.json');

        return new Promise((resolve, reject) => {
            fs.readFile(jsonPath, { encoding: 'utf8' }, (err, chunk) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const data: Manufaturer = JSON.parse(chunk);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                }
            })
        });
    },
    /**
     * 读取目录
     * @param filePath 路径
     */
    readDir(filePath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            })
        });
    },
    /**
     * 创建目录
     * @param dir 目录
     */
    mkDir(dir: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    /**
     * 使用glob查找文件
     * @param exp Glob表达式
     * @param cwd 当前目录
     */
    glob(exp: string, cwd?: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            glob(exp, { cwd }, (err, matches) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(matches);
                }
            });
        });
    },
    /**
     * 验证文件是否存在
     * @param filePath 文件路径
     * @returns {Promise<boolean>} true为存在
     */
    existFile(filePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.access(filePath, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
    /**
     * 删除磁盘上的文件或目录
     * @param filePath 路径
     */
    delDiskFile(filePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            const delExe = path.join(cwd, '../tools/Del/Del.exe');
            const process = execFile(delExe, [filePath], {
                windowsHide: true
            });
            process.once('close', (code) => {
                if (code == 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    /**
     * 拷贝文件到某个目录下
     * @param fileList 文件路径列表
     * @param destination 目标目录，若目录不存在会按传入的层级创建
     * @returns Promise<string[]>
     */
    copyFiles(fileList: string | string[], destination: string, options?: any) {
        return cpy(fileList, destination, options);
    },
    /**
     * 加载线程文件
     * @param workerPath 文件路径
     * @returns Promise<Worker> 返回workerPromise
     */
    loadWorker(workerPath: string): Promise<Worker> {
        return new Promise((resolve, reject) => {
            fs.readFile(workerPath, { encoding: 'utf8' }, (err, chunk) => {
                if (err) {
                    reject(err);
                } else {
                    const sourceCode = new Blob([chunk]);
                    const worker = new Worker(URL.createObjectURL(sourceCode));
                    resolve(worker);
                }
            });
        });
    },
    /**
     * 生成UUID
     * @param len 位数（默认16位）
     */
    newId(len: number = 16) {
        return v4().replace(/-/g, '').substring(len);
    },
    /**
     * 取磁盘容量信息
     * @param {string} diskName 盘符（如：`C:`）
     * @param {boolean} convert2GB 是否转为GB单位
     */
    getDiskInfo(diskName: string, convert2GB: boolean = false): Promise<Record<string, number>> {

        const command = `wmic logicalDisk where "Caption='${diskName}'" get FreeSpace,Size /value`;

        return new Promise((resolve, reject) => {
            exec(command, (err: Error | null, stdout: string) => {
                if (err) {
                    reject(err);
                } else {
                    let cmdResults = stdout.trim().split('\r\r\n');
                    let result = cmdResults.reduce<Record<string, number>>((total, current) => {
                        const [k, v] = current.split('=');
                        if (convert2GB) {
                            total[k] = Number.parseInt(v) / Math.pow(1024, 3);
                        } else {
                            total[k] = Number.parseInt(v);
                        }
                        return total;
                    }, {});
                    resolve(result);
                }
            });
        });
    },
    /**
     * 取全部应用
     * @param apps AppYaml配置
     * @throws 格式有误抛出TypeError
     */
    getAllApps(apps: AppCategory[]): BaseApp[] {
        if (Object.prototype.toString.call(apps) === '[object Array]') {
            return apps.reduce((acc: BaseApp[], current: AppCategory) =>
                acc.concat(current.app_list.map(i => ({
                    m_strID: i.app_id,
                    m_strPktlist: i.packages,
                    name: i.name,
                    key: i.key
                }))), []);
        } else {
            throw new TypeError('应用格式错误');
        }
    },
    /**
     * 返回应用id对应的名称
     * @param appData yaml应用数据
     * @param id 应用id
     */
    getAppDesc(appData: AppCategory[], id: string) {
        const { desc } = appData
            .map((i: any) => i.app_list)
            .flat()
            .find((i: any) => i.app_id === id);
        return desc ? desc : id;
    },
    /**
     * 验证案件名称是否存在
     * @param {string} caseName 案件名称
     * @returns {CaseInfo[]} 数组长度>0表示存在
     */
    async caseNameExist(caseName: string) {
        const db = getDb<CaseInfo>(TableName.Case);
        try {
            let list = await db.find({ m_strCaseName: { $regex: new RegExp(`^${caseName}(?=_)`) } });
            return list;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 验证点验案件名称是否存在
     * @param {string} eventName 案件名称
     * @returns {QuickEvent[]} 数组长度>0表示存在
     */
    async eventNameExist(eventName: string) {
        const db = getDb<QuickEvent>(TableName.QuickEvent);
        try {
            let list = await db.find({ eventName: { $regex: new RegExp(`^${eventName}(?=_)`) } });
            return list;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 检测端口号
     * @param port 端口号
     * @returns 返回可用端口号
     */
    portStat(port: number): Promise<number> {
        const server = net.createServer();
        return new Promise((resolve, reject) => {
            if (typeof port !== 'number') {
                reject(new TypeError('Port is not a number'));
            }
            server.listen(port, '0.0.0.0');
            server.on('listening', () => {
                server.close();
                resolve(port);
            });
            server.on('error', (err: any) => {
                server.close();
                if (err.code === 'EADDRINUSE') {
                    console.log(`端口${port}已占用`);
                    return resolve(this.portStat(++port));
                } else {
                    reject(err);
                }
            });
        });
    },
    /**
     * 字符串转Base64
     * @param value 原值
     * @returns Base64
     */
    stringToBase64(value: string) {
        return Buffer.from(value).toString('base64');
    },
    /**
     * Base64还原string
     * @param base64 Base64值 
     * @returns 原值
     */
    base64ToString(base64: string) {
        return Buffer.from(base64, 'base64').toString('utf8');
    },
    /**
     * 读取应用名称
     */
    readAppName(): string | undefined {
        const jsonPath =
            process.env['NODE_ENV'] === 'development'
                ? path.join(cwd, './data/manufaturer.json')
                : path.join(cwd, './resources/config/manufaturer.json');
        try {
            const data = fs.readFileSync(jsonPath, { encoding: 'utf8' });
            const next = JSON.parse(data);
            return next.materials_name;
        } catch (error) {
            return undefined;
        }
    },
    /**
     * 是否存在manufaturer.json文件
     * @param {String} mode 当前模式
     * @param {String} appPath 应用所在路径
     */
    existManufaturer(mode: string, appPath: string) {
        if (mode === 'development') {
            try {
                fs.accessSync(path.join(appPath, 'data/manufaturer.json'));
                return true;
            } catch (error) {
                return false;
            }
        } else {
            try {
                fs.accessSync(path.join(appPath, '../config/manufaturer.json'));
                return true;
            } catch (error) {
                return false;
            }
        }
    },
    /**
     * 使用显卡黑名单渲染
     */
    useBlackListRender() {
        try {
            fs.accessSync(path.join(cwd, 'blacklist'));
            return true;
        } catch (error) {
            return false;
        }
    },
    /**
     * 写net.json文件
     * @param cwd 工作目录
     * @param chunk 数据
     */
    async writeNetJson(cwd: string, chunk: any) {
        const { writeFile } = fs.promises;

        const saveAs =
            process.env['NODE_ENV'] === 'development'
                ? path.join(cwd, './data/net.json')
                : path.join(cwd, './resources/config/net.json');

        try {
            await writeFile(saveAs, JSON.stringify(chunk), { encoding: 'utf8' });
        } catch (error) {
            log.error(`写入net.json失败 @writeNetJson(): ${error.message}`);
        }
    },
    /**
     * 数据转为下拉列表Options组件
     */
    arrayToOptions(data: Record<string, any>[], nameField: string = 'name', valueField: string = 'value', prefix: string = 'K') {
        return data.map((item, index) => {
            return <Select.Option
                value={item[valueField]} key={`${prefix}${index}_${item[valueField]}`}>
                {item[nameField]}
            </Select.Option>
        })
    },
    /**
     * 读取app.json配置
     */
    async readAppJson(): Promise<AppJson | null> {
        const isDev = process.env['NODE_ENV'] === 'development';
        const target = isDev
            ? path.join(cwd, 'data/app.json')
            : path.join(cwd, 'resources/config/app.json');
        try {
            const prev = await fs.promises.readFile(target, { encoding: 'utf8' });
            return JSON.parse(prev);
        } catch (error) {
            log.error(`读取app.json失败：${error.message}`);
            return null;
        }
    },
    /**
     * 写入app.json配置
     */
    async writeAppJson(data: AppJson): Promise<boolean> {
        const isDev = process.env['NODE_ENV'] === 'development';
        const target = isDev
            ? path.join(cwd, 'data/app.json')
            : path.join(cwd, 'resources/config/app.json');
        try {
            await fs.promises.writeFile(target, JSON.stringify(data), { encoding: 'utf8' });
            return true;
        } catch (error) {
            log.error(`读取app.json失败：${error.message}`);
            return false;
        }
    },
    /**
     * 读取check.json配置
     */
    async readCheckJson(): Promise<CheckJson | null> {
        const isDev = process.env['NODE_ENV'] === 'development';
        const target = isDev
            ? path.join(cwd, 'data/check.json')
            : path.join(cwd, 'resources/config/check.json');
        try {
            const prev = await fs.promises.readFile(target, { encoding: 'utf8' });
            return JSON.parse(prev);
        } catch (error) {
            log.error(`读取check.json失败：${error.message}`);
            return null;
        }
    },
    /**
     * 写入check.json配置
     */
    async writeCheckJson(data: CheckJson): Promise<boolean> {
        const isDev = process.env['NODE_ENV'] === 'development';
        const target = isDev
            ? path.join(cwd, 'data/check.json')
            : path.join(cwd, 'resources/config/check.json');
        try {
            await fs.promises.writeFile(target, JSON.stringify(data), { encoding: 'utf8' });
            return true;
        } catch (error) {
            log.error(`读取check.json失败：${error.message}`);
            return false;
        }
    },
    /**
     * 判断有无IP地址存在
     */
    hasIP(ip: string): boolean {
        const command = 'ipconfig';
        const result = execSync(command, {
            windowsHide: true,
            encoding: 'utf-8'
        });
        return result.includes(ip);
    },
    /**
     * 是否处于调试模式
     */
    async isDebug(): Promise<boolean> {
        try {
            const exist = await this.existFile(path.join(cwd, './debug'));
            return exist;
        } catch (error) {
            return false;
        }
    }
};

export { helper };