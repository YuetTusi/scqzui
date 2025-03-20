import { AnyAction } from 'redux';
import { AiSwitchState } from './index';

export default {
    /**
     * 设置相似度
     */
    setSimilarity(state: AiSwitchState, { payload }: AnyAction) {
        state.similarity = payload;
        return state;
    },
    /**
     * 设置OCR
     */
    setOcr(state: AiSwitchState, { payload }: AnyAction) {
        state.ocr = payload ?? false;
        return state;
    },
    /**
     * 设置禁用OCR
     */
    setDisableOcr(state: AiSwitchState, { payload }: AnyAction) {
        state.disableOcr = payload ?? false;
        return state;
    }
}
