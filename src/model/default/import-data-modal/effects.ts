import { mkdirSync } from 'fs';
import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import DeviceType from '@/schema/device-type';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { DataMode } from '@/schema/data-mode';
import { CaseInfo } from '@/schema/case-info';
import { TableName } from '@/schema/table-name';
import { ImportTypes } from '@/schema/import-type';
import { DeviceSystem } from '@/schema/device-system';
import { FetchState, ParseState } from '@/schema/device-state';
import CommandType, { SocketType } from '@/schema/command';
import { FormValue } from '@/view/default/tool/import-data-modal/prop';

const { parseText } = helper.readConf()!;

export default {
    /** 将第三方导入的手机数据入库到案件下
      * @param {FormValue} payload.formValue 表单数据
      * @param {ImportType} payload.importType 数据类型
      * @param {boolean} payload.useKeyword 开启关键字验证
      * @param {boolean} payload.useDocVerify 开启文档验证
      */
    *saveImportDeviceToCase({ payload }: AnyAction, { call, fork, put }: EffectsCommandMap) {

        const { formValue, importType, useDocVerify, useKeyword } = payload as {
            formValue: FormValue, importType: ImportTypes, useKeyword: boolean, useDocVerify: boolean
        };
        const caseDb = getDb<CaseInfo>(TableName.Case);
        const deviceDb = getDb<DeviceType>(TableName.Device);
        let caseData: CaseInfo | null = null;

        try {
            caseData = yield call([caseDb, 'findOne'], { _id: formValue.caseId });
        } catch (error) {
            logger.error(
                `查询案件失败(_id:${formValue.caseId}) @model/default/import-data-modal/*saveImportDeviceToCase:${error.message}`
            );
        }

        if (caseData === null) {
            return;
        }

        let rec = new DeviceType();
        rec._id = helper.newId();
        rec.mobileHolder = formValue.mobileHolder;
        rec.mobileNo = formValue.mobileNo;
        rec.mobileName = `${formValue.mobileName}_${helper.timestamp()}`;
        rec.note = formValue.note;
        rec.fetchTime = new Date();
        rec.phonePath = join(
            caseData.m_strCasePath,
            caseData.m_strCaseName!,
            formValue.mobileHolder!,
            rec.mobileName
        );
        rec.fetchState = FetchState.Finished;
        rec.mode = DataMode.Self;
        rec.caseId = formValue.caseId; //所属案件id
        rec.parseState = ParseState.Parsing;
        rec.system = (importType === ImportTypes.IOS || importType === ImportTypes.IOSMirror)
            ? DeviceSystem.IOS
            : DeviceSystem.Android;

        let exist: boolean = yield helper.existFile(rec.phonePath);
        if (!exist) {
            //手机路径不存在，创建之
            mkdirSync(rec.phonePath!, { recursive: true });
        }
        //将设备信息写入Device.json
        yield fork([helper, 'writeJSONfile'], join(rec.phonePath, 'Device.json'), {
            mobileHolder: rec.mobileHolder ?? '',
            mobileNo: rec.mobileNo ?? '',
            mobileName: rec.mobileName ?? '',
            note: rec.note ?? '',
            mode: DataMode.Self
        });

        try {
            yield call([deviceDb, 'insert'], {
                _id: rec._id,
                caseId: rec.caseId,
                checker: rec.checker,
                checkerNo: rec.checkerNo,
                fetchState: rec.fetchState,
                parseState: rec.parseState,
                fetchTime: rec.fetchTime,
                fetchType: rec.fetchType,
                manufacturer: rec.manufacturer ?? '',
                mobileHolder: rec.mobileHolder,
                mobileName: rec.mobileName,
                mobileNo: rec.mobileNo,
                mobileNumber: rec.mobileNumber ?? '',
                mode: rec.mode ?? DataMode.Self,
                model: rec.model,
                note: rec.note,
                parseTime: rec.parseTime,
                phonePath: rec.phonePath,
                serial: rec.serial ?? '',
                system: rec.system
            });

            console.log({
                caseId: rec.caseId,
                deviceId: rec._id,
                phonePath: rec.phonePath,
                packagePath: formValue.packagePath,
                sdCardPath: formValue.sdCardPath ?? '',
                dataType: importType,
                mobileName: rec.mobileName,
                mobileHolder: rec.mobileHolder,
                model: rec.mobileName,
                mobileNo: [rec.mobileNo ?? ''], //此字段意义换为IMEI
                note: rec.note ?? '',
                hasReport: caseData?.hasReport ?? false,
                useKeyword,
                useDocVerify
            });

            //#通知Parse开始导入
            yield fork(send, SocketType.Parse, {
                type: SocketType.Parse,
                cmd: CommandType.ImportDevice,
                msg: {
                    caseId: rec.caseId,
                    deviceId: rec._id,
                    phonePath: rec.phonePath,
                    packagePath: formValue.packagePath,
                    sdCardPath: formValue.sdCardPath ?? '',
                    dataType: importType,
                    mobileName: rec.mobileName,
                    mobileHolder: rec.mobileHolder,
                    model: rec.mobileName,
                    mobileNo: [rec.mobileNo ?? ''], //此字段意义换为IMEI
                    note: rec.note ?? '',
                    hasReport: caseData?.hasReport ?? false,
                    useKeyword,
                    useDocVerify
                }
            });

            logger.info(`开始第三方数据导入,参数：${JSON.stringify({
                type: SocketType.Parse,
                cmd: CommandType.ImportDevice,
                msg: {
                    caseId: rec.caseId,
                    deviceId: rec._id,
                    phonePath: rec.phonePath,
                    packagePath: formValue.packagePath,
                    sdCardPath: formValue.sdCardPath ?? '',
                    dataType: importType,
                    mobileName: rec.mobileName,
                    mobileHolder: rec.mobileHolder,
                    model: rec.mobileName,
                    mobileNo: [rec.mobileNo ?? ''], //此字段意义换为IMEI
                    note: rec.note ?? '',
                    hasReport: caseData?.hasReport ?? false,
                    useKeyword,
                    useDocVerify
                }
            })}`);
            yield put({ type: 'setVisible', payload: false });
            message.info(`数据已导入，请在「数据${parseText ?? '解析'}」页面查看进度`);
        } catch (error) {
            logger.error(`设备数据入库失败 @model/default/import-data-modal/*saveImportDeviceToCase: ${error.message}`);
            message.warn('导入失败，请正确选择数据目录');
        }
    }
};