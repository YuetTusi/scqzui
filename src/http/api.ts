import { stat, readdir } from 'fs/promises';
import { basename, join } from 'path';
import xlsx from 'node-xlsx';
import { Router } from 'express';
import { WebContents, ipcMain } from "electron";
import log from '../utils/log';
import { helper } from '../utils/helper';
import { getDb } from '../utils/db';
import { CaseInfo } from '../schema/case-info';
import { TableName } from '../schema/table-name';
import { DeviceType } from '../schema/device-type';
import { ParseState } from '../schema/device-state';
import { QuickEvent } from '../schema/quick-event';
import { QuickRecord } from '../schema/quick-record';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';

/**
 * Http接口
 * @param webContents
 */
function api(webContents: WebContents) {
    const router = Router();

    router.get('/', (req, res) =>
        res.json({
            data: 'HTTP接口',
            routes: [{
                path: '/case',
                desc: '案件数据（解析完成&解析异常）'
            }, {
                path: '/app/:type',
                desc: '解析应用（parse-app），Token云取应用（token-app）'
            }, {
                path: '/wifi-case',
                desc: '快速取证案件'
            }, {
                path: '/keyword',
                desc: '当前关键词'
            }, {
                path: '/check/:id',
                desc: '下载取证APK'
            }]
        })
    );

    router.get('/case', async (req, res) => {

        const caseDb = getDb<CaseInfo>(TableName.Cases);
        const deviceDb = getDb<DeviceType>(TableName.Devices);
        try {
            let [caseList, deviceList]: [CaseInfo[], DeviceType[]] = await Promise.all([
                caseDb.find({}),
                deviceDb.find({
                    $or: [{ parseState: ParseState.Finished }, { parseState: ParseState.Error }]
                })
            ]);
            let nextDevices = deviceList.map((device) => ({
                id: device._id,
                caseId: device.caseId,
                mobileName: device.mobileName,
                phonePath: device.phonePath,
                mobileHolder: device.mobileHolder,
                mobileNo: device.mobileNo ?? '',
                mode: device.mode ?? 0
            }));

            let nextCases = caseList
                .reduce((acc: any[], current: CaseInfo) => acc.concat([
                    {
                        ...current,
                        devices: nextDevices.filter((i) => i.caseId === current._id)
                    }
                ]), [])
                .map(({ _id, m_strCaseName, m_strCasePath, devices }) => ({
                    id: _id,
                    m_strCaseName,
                    m_strCasePath,
                    devices
                }));
            res.json(nextCases)
        } catch (error) {
            log.error(`HTTP查询案件数据失败 @http/api(/case): ${error.message}`);
            res.json([]);
        }
    });

    router.get<{ id: string }>('/wifi-case', async (req, res) => {
        const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
        const recDb = getDb<QuickRecord>(TableName.QuickRecord);
        try {
            let [eventList, recList]: [QuickEvent[], QuickRecord[]] = await Promise.all([
                eventDb.all(),
                recDb.find({
                    $or: [{ parseState: ParseState.Finished }, { parseState: ParseState.Error }]
                })
            ]);
            let nextDevices = recList.map(({
                _id, caseId, phonePath,
                mobileHolder, mobileName,
                mobileNo, mode
            }) => ({
                id: _id,
                caseId,
                mobileName,
                phonePath,
                mobileHolder,
                mobileNo: mobileNo ?? '',
                mode: mode ?? 0
            }));

            let next = eventList
                .reduce((acc: any[], current: QuickEvent) => acc.concat([
                    {
                        ...current,
                        devices: nextDevices.filter((i) => i.caseId === current._id)
                    }
                ]), [])
                .map(({ _id, eventName, eventPath, devices, ruleFrom, ruleTo }) => ({
                    _id,
                    m_strCaseName: eventName,
                    m_strCasePath: eventPath,
                    ruleFrom,
                    ruleTo,
                    devices
                }));
            res.json(next)
        } catch (error) {
            log.error(`HTTP查询案件数据失败 @http/api(/wifi-case): ${error.message}`);
            res.json([]);
        }
    });

    router.get<{ type: string }>('/app/:type', (req, res) => {
        const { type } = req.params;
        ipcMain.once('read-app-yaml-result', (event, result) => res.json(result));
        webContents.send('read-app-yaml', type);
    });

    router.get('/cwd', (req, res) => {
        res.json({ cwd });
    });

    router.get<{ cid: string }>('/check/:cid', async (req, res) => {
        let target = null;
        if (isDev) {
            target = join(cwd, 'data/TZSafe.apk');
        } else {
            target = join(cwd, '../n_fetch/config/android/TZSafe.apk');
        }

        try {
            const { size } = await stat(target);
            webContents.send('quick-scanned', true);
            res.setHeader('Content-Length', size);
            log.info(`下载点验APK附件(${target}), 附件大小:${size}`);
        } catch (error) {
            log.error(`HTTP读取点验附件APK失败 @http/api(/check/:cid): ${error.message}`);
        } finally {
            res.setHeader('Content-type', 'application/octet-stream');
        }

        res.download(target, '快速点验.apk', (err) => {
            if (err) {
                res.end(err.message);
            }
        });
    });

    router.get('/keyword', async (req, res) => {

        const tempPath = join(cwd, './resources/army'); //默认模板位置
        const userPath = join(cwd, './resources/keywords');//用户模板位置
        // const tempPath = join('D:/Electronic/ElectronicForensics/qzui/resources/army'); //默认模板位置
        // const userPath = join('D:/Electronic/ElectronicForensics/qzui/resources/keywords');//用户模板位置
        let data: Record<string, string[]> = {};

        try {
            const exist = await helper.existFile(join(cwd, 'resources/config/app.json'));
            // const exist = await helper.existFile(join(cwd, 'data/app.json'));

            if (exist) {
                const [cfg, tempFiles, userFiles] = await Promise.all([
                    helper.readAppJson(),
                    readdir(tempPath),
                    readdir(userPath)
                ]);
                const { useDefaultTemp, useDocVerify } = cfg!;
                let all: string[] = [];
                if (useDocVerify) {
                    if (useDefaultTemp) {
                        all = all.concat(tempFiles
                            .filter(item => item !== 'template.xlsx')
                            .map(item => join(tempPath, item)));
                    }
                    all = all.concat(userFiles
                        .filter((item) => item !== 'template.xlsx' && !item.startsWith('~'))
                        .map(item => join(userPath, item)));
                }

                data = all.reduce<Record<string, string[]>>((acc, current) => {
                    const sort = basename(current, '.xlsx');
                    try {
                        const [sheet] = xlsx.parse(current);
                        if (sheet.data && sheet.data.length > 0) {
                            sheet.data.shift();
                            acc[sort] = (sheet.data as any[])
                                .filter((k) => k[0] !== undefined && k[0] !== null && k[0] !== '')
                                .map((k) => k[0]);
                        }
                    } catch (error) {
                        if (error.message.includes('password-protected')) {
                            log.warn(`未能读取${current}: Excel已加密`);
                        } else {
                            log.warn(`读取${current}.xlsx失败: ${error.message}`);
                        }
                    }
                    return acc;
                }, {});
                res.json(data);
            } else {
                res.json(null);
            }
        } catch (error) {
            log.error(`读取关键词失败: ${error.message}`);
            res.json(null);
        }
    });

    //接收点验结果发送给mainWindow入库并开始解析
    router.post('/check', (req, res) => {
        webContents.send('check-parse', req.body);
        res.json({
            success: true,
            data: req.body
        });
    });

    return router;
}

export { api };
