import { AnyAction } from 'redux';
import { CloudState } from ".";

export default {
    /**
     * 设置云取数据
     * @param {FetchData} payload 
     */
    setData(state: CloudState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    /**
     * 删除云取应用
     * @param payload 云应用id
     */
    removeCloudApp(state: CloudState, { payload }: AnyAction) {
        if (state.data !== null) {
            state.data.cloudAppList =
                (state.data.cloudAppList ?? [])
                    .filter(item => item.m_strID !== payload);
        }
        return state;
    },
    /**
     * 设置云应用
     * @param {CloudApp} payload 云应用
     */
    setCloudApp(state: CloudState, { payload }: AnyAction) {
        if (state.data !== null) {
            state.data.cloudAppList =
                (state.data.cloudAppList ?? [])
                    .map(item => {
                        if (item.m_strID === payload.m_strID) {
                            return payload;
                        } else {
                            return item;
                        }
                    });
        }
        return state;
    }
};