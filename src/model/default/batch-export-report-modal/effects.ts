import { AnyAction } from "redux";
import { EffectsCommandMap } from "dva";
import CaseInfo from "@/schema/case-info";
import DeviceType from "@/schema/device-type";
import { TableName } from "@/schema/table-name";
import { getDb } from "@/utils/db";

export default {

    *queryDevicesByCaseId({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const caseDb = getDb(TableName.Case);
        const deviceDb = getDb(TableName.Device);
        try {
            const [caseData, devices]: [CaseInfo, DeviceType[]] = yield all([
                call([caseDb, 'findOne'], { _id: payload }),
                call([deviceDb, 'find'], { caseId: payload })
            ]);
            yield put({ type: 'setCaseName', payload: caseData.m_strCaseName });
            yield put({ type: 'setDevices', payload: devices });
        } catch (error) {

        }
    }
};