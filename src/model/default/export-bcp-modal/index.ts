import { Model } from 'dva';
import { CaseInfo } from '@/schema/case-info';
import { DeviceType } from '@/schema/device-type';
import reducers from './reducers';
import effects from './effects';

interface ExportBcpModalState {
    /**
     * 正在导出状态
     */
    exporting: boolean,
    /**
     * 是否是批量导出
     * * 批量读取exportBcpCase下所有设备的BCP文件
     * * 非批量读取exportBcpDevice下的BCP文件
     */
    isBatch: boolean,
    /**
     * 案件数据
     */
    exportBcpCase: CaseInfo,
    /**
     * 设备数据
     */
    exportBcpDevice: DeviceType
}

let model: Model = {
    namespace: 'exportBcpModal',
    state: {
        exporting: false,
        isBatch: false,
        exportBcpCase: {},
        exportBcpDevice: {}
    },
    reducers,
    effects
};

export { ExportBcpModalState };
export default model;