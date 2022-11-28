import { mkdirSync } from 'fs';
import { join } from 'path';
import { EffectsCommandMap } from "dva";
import { AnyAction } from 'redux';
import { routerRedux } from "dva/router";
import message from "antd/lib/message";
import { StateTree } from '@/type/model';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from "@/utils/helper";
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { TableName } from '@/schema/table-name';
import { CaseInfo } from '@/schema/case-info';
import { AiSwitchState } from '../ai-switch';

export default {

    /**
     * 保存案件
     * @param {CaseInfo} payload.entity 案件
     * @param {string} payload.name 
     */
    *saveCase({ payload }: AnyAction, { call, fork, put, select }: EffectsCommandMap) {
        const db = getDb<CaseInfo>(TableName.Cases);
        const { entity, name } = payload as { entity: CaseInfo, name: string | null };
        const casePath = join(entity.m_strCasePath, entity.m_strCaseName);
        yield put({ type: 'setSaving', payload: true });
        //#部分表单域记录历史，下次可快速输入
        UserHistory.set(HistoryKeys.HISTORY_UNITNAME, entity.m_strCheckUnitName);

        try {
            const aiSwitch: AiSwitchState = yield select((state: StateTree) => state.aiSwitch);
            yield call([db, 'insert'], entity);
            if (helper.isNullOrUndefined(name)) {
                yield put(routerRedux.push('/case-data'));
            } else {
                //# 如果是从取证页面跳转过来，name即有值，跳回取证页面
                yield put(routerRedux.push('/collect'));
            }
            let exist: boolean = yield helper.existFile(casePath);
            if (!exist) {
                //案件路径不存在，创建之
                mkdirSync(casePath);
            }
            yield fork([helper, 'writeCaseJson'], casePath, entity);
            yield fork([helper, 'writeJSONfile'], join(casePath, 'predict.json'), {
                config: aiSwitch.data,
                similarity: aiSwitch.similarity,
                ocr: aiSwitch.ocr
            }); //写ai配置JSON
            message.success('保存成功');
        } catch (error) {
            console.error(`@modal/CaseAdd.ts/saveCase: ${error.message}`);
            logger.error(`@modal/default/case-add/*saveCase:${error.message}`);
            message.error('保存失败');
        } finally {
            yield put({ type: 'setSaving', payload: false });
        }
    }
}