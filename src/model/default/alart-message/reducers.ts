import { AnyAction } from "redux";
import { AlartMessageInfo } from "@/component/alert-message/prop";
import { AlartMessageState } from ".";

export default {
    /**
     * 添加全局提示消息
     * @param {AlartMessageInfo} payload 消息内容（一条）
     */
    addAlertMessage(state: AlartMessageState, { payload }: AnyAction) {
        state.alertMessage.push(payload);
        return state;
    },
    /**
     * 更新全局消息
     * @param {AlartMessageInfo} payload 消息内容（一条）
     */
    updateAlertMessage(state: AlartMessageState, { payload }: AnyAction) {
        const { id, msg } = payload as AlartMessageInfo;
        state.alertMessage = state.alertMessage.map(item => {
            if (item.id === id) {
                item.msg = msg;
                return item;
            } else {
                return item;
            }
        });
        return state;
    },
    /**
     * 删除id的消息
     * @param {string} payload 唯一id
     */
    removeAlertMessage(state: AlartMessageState, { payload }: AnyAction) {
        const next = state.alertMessage.filter(i => i.id !== payload);
        state.alertMessage = next;
        return state;
    },
};