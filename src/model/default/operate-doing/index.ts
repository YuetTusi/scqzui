import { Model } from 'dva';
import reducers from './reducers';

interface OperateDoingState {
    /**
     * 正在生成报告的设备id
     */
    creatingDeviceId: string[],
    /**
     * 正在导出报告的设备id
     * *为空数组表示无导出任务
     */
    exportingDeviceId: string[]
}

/**
 * 记录用户创建，导出相关状态Model
 */
let model: Model = {
    namespace: 'operateDoing',
    state: {
        creatingDeviceId: [],
        exportingDeviceId: []
    },
    reducers
};

export { OperateDoingState };
export default model;