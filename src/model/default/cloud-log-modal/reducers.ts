import { AnyAction } from 'redux';
import { CloudLogModalState } from './index'

export default {

    /**
     * 设置隐藏/显示
     * @param {boolean} payload 
     */
    setVisible(state: CloudLogModalState, { payload }: AnyAction) {
        state.visible = payload;
        return state;
    },
    /**
     * 设置当前云取应用
     * @param {CloudAppMessages[]} payload 
     */
    setCloudApps(state: CloudLogModalState, { payload }: AnyAction) {
        state.cloudApps = payload;
        return state;
    }
};