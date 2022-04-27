import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';

export default {

    /**
     * 点验案件保存
     */
    *saveOrUpdate({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        /**
         * todo: 待完成编辑功能
         */
        const db = getDb<QuickEvent>(TableName.QuickEvent);
        const targetPath = join(payload.eventPath, payload.eventName);
        try {
            if (helper.isNullOrUndefined(payload._id)) {
                yield helper.mkDir(targetPath);
                yield call([db, 'insert'], payload);
            } else {
                yield call([db, 'update'], { _id: payload._id }, payload);
            }
            yield helper.writeJSONfile(join(targetPath, 'Case.json'), {
                "m_strCaseName": payload.eventName,
                "caseType": 1,
                "spareName": "",
                "m_strCasePath": payload.eventPath,
                "sdCard": true,
                "hasReport": true,
                "m_bIsAutoParse": true,
                "generateBcp": false,
                "attachment": false,
                "isDel": false,
                "m_Applist": [],
                "tokenAppList": [],
                "m_strCheckUnitName": "",
                "officerName": "",
                "securityCaseType": "",
                "isAi": false,
                "aiThumbnail": false,
                "aiWeapon": false,
                "aiDoc": false,
                "aiDrug": false,
                "aiNude": false,
                "aiMoney": false,
                "aiDress": false,
                "aiTransport": false,
                "aiCredential": false,
                "aiTransfer": false,
                "aiScreenshot": false,
                "ruleFrom": payload.ruleFrom,
                "ruleTo": payload.ruleTo,
                "caseName": payload.eventName,
                "checkUnitName": ""
            });
            message.success('保存成功');
            yield put({ type: 'setData', payload: undefined });
            yield put({
                type: 'quickEventList/query', payload: {
                    pageIndex: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        } catch (error) {
            console.warn(error);
            message.warn('保存失败');
        } finally {
            yield put({ type: 'setVisible', payload: false });
        }
    }
};