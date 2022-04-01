import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CaseInfo } from '@/schema/case-info';
import { TableName } from '@/schema/table-name';
import { FetchData } from '@/schema/fetch-data';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';

export default {
    /**
     * 查询案件下拉列表数据
     */
    *queryCaseList({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<CaseInfo>(TableName.Case);
        try {
            const caseList: CaseInfo[] = yield call([db, 'find'], {}, 'createdAt', -1);
            yield put({ type: 'setCaseList', payload: caseList });
        } catch (error) {
            log.error(`绑定案件数据出错 @model/default/check-input-modal/*queryCaseList: ${error.message}`);
        }
    },
    /**
     * 录入点验设备记录
     * 用户采集时录入当前设备，下次采集时若存在直接走流程，免去用户再次输入
     * @param {FetchData} payload 采集设备数据
     */
    *insertCheckData({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        const db = getDb<FetchData>(TableName.CheckData);
        if (helper.isNullOrUndefined(payload.serial)) {
            log.error(`点验数据入库失败,序列号为空 @model/default/check-input-modal/*insertCheckData`);
            return;
        }
        try {
            yield fork([db, 'insert'], payload);
        } catch (error) {
            log.error(`点验数据入库失败 @model/default/check-input-modal/*insertCheckData: ${error.message}`);
        }
    }
};