import { AnyAction } from 'redux';
import { AppSetStore } from ".";

export default {
    /**
     * 设置全局读取状态
     */
    setReading(state: AppSetStore, { payload }: AnyAction) {
        state.reading = payload;
        return state;
    },
    /**
     * 设置模式
     * @param {DataMode} payload 模式枚举 
     */
    setDataMode(state: AppSetStore, { payload }: AnyAction) {
        state.dataMode = payload;
        return state;
    },
    /**
     * 设置警综平台数据
     * @param {SendCase | null} payload 平台数据，清空数据传null
     */
    setSendCase(state: AppSetStore, { payload }: AnyAction) {
        state.sendCase = payload;
        return state;
    },
    /**
     * 设置警综平台采集人员
     * @param {Officer} payload 采集人员对象
     */
    setSendOfficer(state: AppSetStore, { payload }: AnyAction) {
        state.sendOfficer = [payload];
        return state;
    },
    /**
     * 设置云取应用数据
     * @param {AppCategory[]} payload
     */
    setCloudAppData(state: AppSetStore, { payload }: AnyAction) {
        state.cloudAppData = payload;
        return state;
    },
    /**
     * 设置应用输入项值
     * @param {string} payload.app_id 应用id
     * @param {string} paylaod.name 名称
     * @param {string} payload.value 值
     */
    setExtValue(state: AppSetStore, { payload }: AnyAction) {
        state.cloudAppData = state.cloudAppData.map(category => {
            category.app_list = category.app_list.map(app => {
                if (app.app_id === payload.app_id && app.ext !== undefined) {
                    for (let i = 0; i < app.ext.length; i++) {
                        if (app.ext[i].name === payload.name) {
                            app.ext[i].value = payload.value;
                            break;
                        }
                    }
                }
                return app;
            });
            return category;
        });
        return state;
    },
    /**
     * 清空所有输入参数的值
     */
    clearExtValue(state: AppSetStore, { }: AnyAction) {
        state.cloudAppData = state.cloudAppData.map(category => {
            category.app_list = category.app_list.map((app) => {
                if (app.ext && app.ext.length > 0) {
                    app.ext = app.ext.map(item => ({ ...item, value: '' }));
                }
                return app;
            });
            return category;
        });
        return state;
    }
};