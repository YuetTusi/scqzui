import { mkdirSync } from 'fs';
import { join } from 'path';
import merge from 'lodash/merge';
import { AnyAction } from 'redux';
import { EffectsCommandMap, routerRedux } from "dva";
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { TableName } from '@/schema/table-name';
import { FetchData } from '@/schema/fetch-data';
import { CaseInfo } from '@/schema/case-info';
import { getDb } from '@/utils/db';
import logger from '@/utils/log';
import { helper } from '@/utils/helper';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { AiSwitchState } from '../ai-switch';

const predictTempAt = helper.IS_DEV
    ? join(helper.APP_CWD, './data/predict.json')
    : join(helper.APP_CWD, './resources/config/predict.json'); //模版路径

export default {

    /**
     * 按id查询案件
     * @param {string} payload 案件id 
     */
    *queryById({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const db = getDb<CaseInfo>(TableName.Cases);
        yield put({ type: 'setLoading', payload: true });
        try {
            const data: CaseInfo = yield call([db, 'findOne'], { _id: payload });
            yield put({ type: 'setData', payload: data });
        } catch (error) {
            logger.error(`读取案件失败 @model/default/case-edit/*queryById:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 保存案件
     * @param {CaseInfo} payload 案件
     */
    *saveCase({ payload }: AnyAction, { all, call, fork, put, select }: EffectsCommandMap) {
        const db = getDb<CaseInfo>(TableName.Cases);
        yield put({ type: 'setLoading', payload: true });
        UserHistory.set(HistoryKeys.HISTORY_UNITNAME, payload.m_strCheckUnitName);//将用户输入的单位名称记录到本地存储中，下次输入可读取
        try {
            const aiSwitch: AiSwitchState = yield select((state: StateTree) => state.aiSwitch);
            const [predict, prev]: [Record<string, any>, CaseInfo] = yield all([
                call([helper, 'readJSONFile'], predictTempAt),
                call([db, 'findOne'], { _id: payload._id })
            ]);
            yield call(
                [db, 'update'],
                { _id: payload._id },
                {
                    ...payload,
                    m_strCaseName: prev.m_strCaseName,
                    useAiOcr: !aiSwitch.disableOcr
                }
            );
            yield put({
                type: 'updateCheckDataFromCase', payload: {
                    caseId: payload._id,
                    sdCard: payload.sdCard,
                    isAuto: payload.m_bIsAutoParse,
                    hasReport: payload.hasReport,
                    appList: payload.m_Applist,
                    useAiOcr: !aiSwitch.disableOcr
                }
            }); //同步更新点验记录
            const casePath = join(payload.m_strCasePath, prev.m_strCaseName);
            let exist: boolean = yield helper.existFile(casePath);
            if (!exist) {
                //案件路径不存在，创建之
                mkdirSync(casePath);
            }
            yield fork([helper, 'writeCaseJson'], casePath, payload);
            yield fork(
                [helper, 'writeJSONfile'],
                join(casePath, 'predict.json'),
                merge(predict, {
                    config: aiSwitch.data,
                    similarity: aiSwitch.similarity,
                    ocr: aiSwitch.ocr
                })
            ); //写ai配置JSON
            yield put(routerRedux.push('/case-data'));
            message.success('保存成功');
        } catch (error) {
            console.error(`编辑案件失败 @model/default/case-edit/*saveCase: ${error.message}`);
            message.error('保存失败');
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 更新点验记录表中案件的应用包名
     * @param {string} payload.caseId 案件名称
     * @param {boolean} payload.sdCard 是否拉取SD卡
     * @param {boolean} payload.isAuto 是否自动解析
     * @param {boolean} payload.hasReport 是否生成报告
     * @param {ParseApp[]} payload.appList 应用列表
     */
    *updateCheckDataFromCase({ payload }: AnyAction, { call, fork }: EffectsCommandMap) {
        const db = getDb(TableName.CheckData);
        const { caseId, sdCard, isAuto, hasReport, appList } = payload;
        try {
            let record: FetchData = yield call([db, 'findOne'], { caseId });
            if (record) {
                record.sdCard = sdCard;
                record.isAuto = isAuto;
                record.hasReport = hasReport;
                record.appList = appList;
                yield fork([db, 'update'], { caseId }, record, true);//更新点验记录
            }
        } catch (error) {
            logger.error(`更新点验记录失败 @model/default/case-edit/*updateCheckDataFromCase:${error.message}`);
        }
    }
};