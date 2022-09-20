import { AnyAction } from "redux";
import { EffectsCommandMap } from "dva";
import CaseInfo from "@/schema/case-info";
import DeviceType from "@/schema/device-type";
import { TableName } from "@/schema/table-name";
import { getDb } from "@/utils/db";
import log from "@/utils/log";

export default {

    *queryDevicesByCaseId({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const caseDb = getDb(TableName.Cases);
        const deviceDb = getDb(TableName.Devices);
        try {
            const [caseData, devices]: [CaseInfo, DeviceType[]] = yield all([
                call([caseDb, 'findOne'], { _id: payload }),
                call([deviceDb, 'find'], { caseId: payload })
            ]);
            yield put({ type: 'setCaseName', payload: caseData.m_strCaseName });
            yield put({ type: 'setDevices', payload: devices });
        } catch (error) {
            log.error(`@model/default/batch-export-report-modal/*queryDevicesByCaseId:${error.message}`);
        }
    }
};