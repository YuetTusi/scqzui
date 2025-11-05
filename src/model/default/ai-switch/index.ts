import { Model } from 'dva';
import { Predict } from '@/component/ai-switch';
import reducers from './reducers';
import effects from './effects';
import { AiOcrType } from '@/schema/case-info';


interface AiSwitchState {
    /**
     * AI配置
     */
    data: Predict[],
    /**
     * 相似度值(0~100)
     */
    similarity: number,
    /**
     * 分析类型
     */
    aiType: AiOcrType,
    /**
     * 是否启用AI分析
     * （706专用，当案件是`有线快采`则使用此参数）
     */
    isAi: boolean,
}



/**
 * AI配置组件Model
 */
let model: Model = {

    namespace: 'aiSwitch',
    state: {
        data: [],
        similarity: 0,
        aiType: AiOcrType.Close,
        isAi: false
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;