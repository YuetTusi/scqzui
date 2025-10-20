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
    aiType: AiOcrType
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
        ocr: false,
        disableOcr: false
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;