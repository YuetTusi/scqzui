import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { StateTree } from '@/type/model';
import { AiSwitchState } from '../ai-switch';

const { caseText } = helper.readConf()!;

export default {
    /**
     * 点验案件保存
     */
    *saveOrUpdate({ payload }: AnyAction, { call, fork, put, select }: EffectsCommandMap) {

        const db = getDb<QuickEvent>(TableName.QuickEvent);
        const { _id, eventName, eventPath } = payload as QuickEvent;
        const targetPath = join(eventPath, eventName);
        try {
            const aiSwitch: AiSwitchState = yield select((state: StateTree) => state.aiSwitch);
            if (helper.isNullOrUndefined(_id)) {
                yield helper.mkDir(targetPath);
                yield call([db, 'insert'], payload);
                message.success(`保存成功，请点击${caseText ?? '案件'}名称扫码点验`);
            } else {
                yield call([db, 'update'], { _id }, payload);
                message.success('保存成功');
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
                "ruleFrom": payload.ruleFrom,
                "ruleTo": payload.ruleTo,
                "caseName": payload.eventName,
                "checkUnitName": ""
            });
            yield fork([helper, 'writeJSONfile'], join(targetPath, 'predict.json'), {
                config: aiSwitch.data,
                similarity: aiSwitch.similarity,
                ocr: aiSwitch.ocr
            }); //写ai配置JSON
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
