import { AnyAction } from 'redux';
import { LoginState } from '.';

export default {
    /**
     * 注册用户打开/关闭
     */
    setRegisterUserModalVisible(state: LoginState, { payload }: AnyAction) {
        state.registerUserModalVisible = payload;
        return state;
    },
    /**
     * 更新错误次数
     */
    setMistake(state: LoginState, { payload }: AnyAction) {
        state.mistake = payload;
        return state;
    },
    /**
     * 更新loading
     */
    setLoading(state: LoginState, { payload }: AnyAction) {
        state.loading = payload;
        return state;
    }
};