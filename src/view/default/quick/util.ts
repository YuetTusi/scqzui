import { statSync } from 'fs';
import { join, sep } from 'path';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { DataMode } from '@/schema/data-mode';
import { FetchState, ParseState } from '@/schema/device-state';
import { CaseJson, DeviceJson } from '../case/case-data/prop';
import { QuickRecord } from '@/schema/quick-record';
import { QuickEvent } from '@/schema/quick-event';

const { caseText, devText } = helper.readConf()!;

/**
 * 导入设备
 * @param deviceJsonPath 设备路径
 * @param eventData 设备所属案件
 */
async function importRec(deviceJsonPath: string, eventData: QuickEvent) {
    const db = getDb<QuickRecord>(TableName.QuickRecord);
    const devicePath = join(deviceJsonPath, '../');
    try {
        const deviceJson: DeviceJson = await helper.readJSONFile(deviceJsonPath);
        if (helper.isNullOrUndefined(deviceJson.mobileName)) {
            throw new Error(`读取${devText ?? '设备'}名称失败`);
        }
        if (helper.isNullOrUndefined(deviceJson.mobileHolder)) {
            throw new Error(`读取${devText ?? '设备'}持有人失败`);
        }

        const [isParse, current] = await Promise.all([
            helper.existFile(join(devicePath, './out/ParseInfo.json')),
            db.find({ mobileName: deviceJson.mobileName })
        ]);

        if (current.length === 0) {
            const next = new QuickRecord();
            next.caseId = eventData._id;
            next._id = helper.newId();
            next.mobileHolder = deviceJson.mobileHolder;
            next.mobileName = deviceJson.mobileName;
            next.mobileNo = deviceJson.mobileNo;
            next.note = deviceJson.note;
            next.mode = deviceJson.mode ?? DataMode.Self;
            next.phonePath = devicePath;
            next.fetchTime = getTimeFromPath(devicePath);
            next.parseState = isParse ? ParseState.Finished : ParseState.NotParse;
            next.fetchState = FetchState.Finished;
            await db.insert(next);
        }

    } catch (error) {
        throw new Error(`导入${devText ?? '设备'}检材数据失败`);
    }
}

/**
 * 读取Case.json
 * @param jsonPath Case.json路径
 * @returns 返回JSON内容
 */
async function readCaseJson(jsonPath: string) {
    try {
        const json: Record<string, any> = await helper.readJSONFile(jsonPath);

        return {
            ...json,
            sdCard: json.sdCard ?? true,
            hasReport: json.hasReport ?? true,
            m_bIsAutoParse: json.m_bIsAutoParse ?? true
        } as Record<string, any>;
    } catch (error) {
        throw new Error(`读取${caseText ?? '案件'}数据失败`);
    }
}


/**
 * 按案件名称查询案件数据，案件不存在则创建
 * @param caseJson Case.json
 * @param casePath 案件路径
 */
async function getEventByName(caseJson: Record<string, any>, casePath: string) {
    const db = getDb<QuickEvent>(TableName.QuickEvent);
    try {
        const [current] = await db.find({ eventName: caseJson.caseName });
        if (current) {
            //案件存在
            return current as QuickEvent;
        } else {
            //案件不存在
            const next: QuickEvent = {
                _id: helper.newId(),
                eventName: caseJson.caseName,
                eventPath: casePath,
                ruleFrom: caseJson.ruleFrom ?? 0,
                ruleTo: caseJson.ruleTo ?? 8
            };
            await db.insert(next);
            return next;
        }
    } catch (error) {
        throw new Error(`导入${caseText ?? '案件'}数据失败`);
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

export { getEventByName, importRec, readCaseJson, readDirOnly };