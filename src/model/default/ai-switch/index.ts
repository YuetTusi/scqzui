import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { Predict } from '@/view/default/case/ai-switch';

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
     * 启用OCR识别
     */
    ocr: boolean
}



/**
 * AI配置组件Model
 */
let model: Model = {

    namespace: 'aiSwitch',
    state: {
        data: [],
        similarity: 0,
        ocr: false
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;