import { AnyAction } from 'redux';
import { ExportBcpModalState } from '.';

export default {
    /**
     * 设置正在导出状态
     * @param {boolean} payload 
     */
    setExporting(state: ExportBcpModalState, { payload }: AnyAction) {
        state.exporting = payload;
        return state;
    },
    /**
     * 设置是否批量导出
     * @param {boolean} payload 是否是批量
     */
    setIsBatch(state: ExportBcpModalState, { payload }: AnyAction) {
        state.isBatch = payload;
        return state;
    },
    /**
     * 批量导出的案件数据
     * @param {CCaseInfo} payload 案件
     */
    setExportBcpCase(state: ExportBcpModalState, { payload }: AnyAction) {
        state.exportBcpCase = payload;
        return state;
    },
    /**
    * 导出BCP的设备
    * @param {DeviceType} payload 设备
    */
    setExportBcpDevice(state: ExportBcpModalState, { payload }: AnyAction) {
        state.exportBcpDevice = payload;
        return state;
    }
}