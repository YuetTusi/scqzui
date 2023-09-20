import { AnyAction } from 'redux';
import { ApkModalState } from ".";

export default {
    /**
     * 设置apk列表 
     * @param {Apk[]} payload 设备列表
     */
    setApk(state: ApkModalState, { payload }: AnyAction) {
        state.apk = payload;
        return state;
    },
    /**
     * 设备手机列表
     */
    setPhone(state: ApkModalState, { payload }: AnyAction) {
        state.phone = payload;
        return state;
    }
};