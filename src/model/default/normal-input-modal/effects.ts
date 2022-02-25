import { ipcRenderer } from 'electron';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { TableName } from '@/schema/table-name';
import CaseInfo from '@/schema/case-info';
import log from '@/utils/log';
import { Db } from '@/utils/db';

export default {
    /**
     * 查询案件下拉列表数据
     */
    *queryCaseList({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const db = new Db(TableName.Case);
        try {
            let caseList: CaseInfo[] = yield call(
                [db, 'find'],
                {},
                'createdAt',
                -1
            );
            yield put({ type: 'setCaseList', payload: caseList });
        } catch (error) {
            log.error(`绑定案件数据出错 @model/dashboard/Device/CaseInputMdal/queryCaseList: ${error.message}`);
        }
    }
};