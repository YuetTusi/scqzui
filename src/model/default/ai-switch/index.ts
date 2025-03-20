import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';


interface AiSwitchState {
    /**
     * 相似度值(0~100)
     */
    similarity: number,
    /**
     * 启用OCR识别
     */
    ocr: boolean,
    /**
     * 禁用OCR识别
     */
    disableOcr: boolean
}



/**
 * AI配置组件Model
 */
let model: Model = {

    namespace: 'aiSwitch',
    state: {
        similarity: 0,
        ocr: false,
        disableOcr: false
    },
    reducers,
    effects
};

export { AiSwitchState };
export default model;