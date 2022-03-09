import { SubscriptionAPI } from "dva";

export default {

    /**
     * 读取单位设置信息
     */
    loadOrganization({ dispatch }: SubscriptionAPI) {
        dispatch({ type: 'query' });
    }
}