import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { helper } from '@/utils/helper';
import { PredictJson } from '@/component/ai-switch';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';
const tempAt = isDev
    ? join(cwd, './data/predict.json')
    : join(cwd, './resources/config/predict.json'); //模版路径

export default {

    /**
     * 读取案件下predict.json或模版JSON
     * @param {string} payload.casePath 案件路径 （如果案件下无predict.json，读取模版文件）
     */
    *readAiConfig({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { casePath } = payload as { casePath: string };
        try {
            const temp: PredictJson = yield call([helper, 'readJSONFile'], tempAt);

            if (casePath === undefined) {
                //无案件目录，是新增，读模版
                yield put({ type: 'setData', payload: temp.config });
                yield put({ type: 'setSimilarity', payload: temp.similarity });
                yield put({ type: 'setOcr', payload: temp.ocr });
            } else {
                const aiConfigAt = join(casePath, './predict.json'); //当前案件AI路径
                const exist: boolean = yield call([helper, 'existFile'], aiConfigAt);
                if (exist) {
                    //案件下存在，读取案件下的predict.json
                    const caseAi: PredictJson = yield call([helper, 'readJSONFile'], aiConfigAt);
                    const next = { ...temp, ...caseAi };
                    yield put({ type: 'setData', payload: next.config });
                    yield put({ type: 'setSimilarity', payload: next.similarity });
                    yield put({ type: 'setOcr', payload: next.ocr });
                } else {
                    //不存在，读取模版
                    const next: PredictJson = yield call([helper, 'readJSONFile'], tempAt);
                    yield put({ type: 'setData', payload: next.config });
                    yield put({ type: 'setSimilarity', payload: next.similarity });
                    yield put({ type: 'setOcr', payload: next.ocr });
                }
            }
        } catch (error) {
            console.warn(`读取predict.json失败, @view/default/case/ai-switch:${error.message}`);
            yield put({ type: 'setData', payload: [] });
            yield put({ type: 'setSimilarity', payload: 0 });
            yield put({ type: 'setOcr', payload: false });
        }
    }
};