import { statSync } from 'fs';
import { join, sep } from 'path';
import { ipcRenderer } from 'electron';
import { helper } from '@/utils/helper';
import { CaseInfo } from '@/schema/case-info';
import { TableName } from '@/schema/table-name';
import { DeviceType } from '@/schema/device-type';
import { DataMode } from '@/schema/data-mode';
import { FetchState, ParseState } from '@/schema/device-state';
import { CaseJson, DeviceJson } from './prop';
import { getDb } from '@/utils/db';

/**
 * 导入设备
 * @param deviceJsonPath 设备路径
 * @param caseData 设备所属案件
 */
async function importDevice(deviceJsonPath: string, caseData: CaseInfo) {
    const db = getDb<DeviceType>(TableName.Device);
    const devicePath = join(deviceJsonPath, '../');
    try {
        const deviceJson: DeviceJson = await helper.readJSONFile(deviceJsonPath);
        if (helper.isNullOrUndefined(deviceJson.mobileName)) {
            throw new Error('读取设备名称失败');
        }
        if (helper.isNullOrUndefined(deviceJson.mobileHolder)) {
            throw new Error('读取设备持有人失败');
        }
        const [isParse, current] = await Promise.all([
            helper.existFile(join(devicePath, './out/baseinfo.json')),
            db.find({ mobileName: deviceJson.mobileName })
        ]);

        if (current.length === 0) {
            const nextDevice = new DeviceType();
            nextDevice.caseId = caseData._id;
            nextDevice._id = helper.newId();
            nextDevice.mobileHolder = deviceJson.mobileHolder;
            nextDevice.mobileName = deviceJson.mobileName;
            nextDevice.mobileNo = deviceJson.mobileNo;
            nextDevice.note = deviceJson.note;
            nextDevice.mode = deviceJson.mode ?? DataMode.Self;
            nextDevice.phonePath = devicePath;
            nextDevice.fetchTime = getTimeFromPath(devicePath);
            nextDevice.parseState = isParse ? ParseState.Finished : ParseState.NotParse;
            nextDevice.fetchState = FetchState.Finished;
            await db.insert(nextDevice);
        }

    } catch (error) {
        throw new Error('导入设备检材数据失败');
    }
}

/**
 * 读取Case.json
 * @param jsonPath Case.json路径
 * @returns 返回JSON内容
 */
async function readCaseJson(jsonPath: string) {
    try {
        const json: CaseJson = await helper.readJSONFile(jsonPath);

        return {
            ...json,
            sdCard: json.sdCard ?? true,
            hasReport: json.hasReport ?? true,
            m_bIsAutoParse: json.m_bIsAutoParse ?? true
        };
    } catch (error) {
        throw new Error('读取案件数据失败');
    }
}


/**
 * 按案件名称查询案件数据，案件不存在则创建
 * @param caseJson Case.json
 * @param casePath 案件路径
 */
async function getCaseByName(caseJson: CaseJson, casePath: string) {
    const db = getDb<CaseInfo>(TableName.Case);
    try {
        const [current] = await db.find({ m_strCaseName: caseJson.caseName });
        if (current) {
            //案件存在
            return current as CaseInfo;
        } else {
            //案件不存在
            const next: CaseInfo = {
                ...caseJson,
                _id: helper.newId(),
                m_strCaseName: caseJson.caseName,
                m_strCasePath: casePath
            };
            await db.insert(next);
            return next;
        }
    } catch (error) {
        throw new Error('导入案件数据失败');
    }
}

/**
 * 截取路径时间戳
 * @param dir 路径
 */
function getTimeFromPath(dir: string) {

    if (dir.endsWith('\\')) {
        dir = dir.substring(0, dir.lastIndexOf('\\'));
    }
    const chunk = dir.split(sep);
    const [, timestamp] = chunk[chunk.length - 1].split('_');

    try {
        return helper.parseDate(timestamp, 'YYYYMMDDHHmmss').toDate();
    } catch (error) {
        return new Date();
    }
}

/**
 * 读取目标目录下的目录
 * @param casePath 案件目录
 * @returns  只返回目录
 */
async function readDirOnly(targetPath: string) {
    try {
        let holderDir: string[] = [];
        holderDir = await helper.readDir(targetPath);
        return holderDir.filter((i) => statSync(join(targetPath, i)).isDirectory());
    } catch (error) {
        throw new Error('读取检材目录失败');
    }
}

export { getCaseByName, importDevice, readCaseJson, readDirOnly };