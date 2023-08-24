import { Model } from "dva";
import reducers from './reducers';
import effects from './effects';
import { DeviceType } from "@/schema/device-type";
import { QuickEvent } from "@/schema/quick-event";
import { QuickRecord } from "@/schema/quick-record";

interface BatchExportReportModalState {

    /**
     * 批量导出的案件id
     */
    devices: DeviceType[],
    /**
     * 当前案件名称
     */
    caseName: string,
    /**
     * 批量导出的设备id（快取）
     */
    records: QuickRecord[],
    /**
     * 案件名称（快取）
     */
    eventName: string
}

let model: Model = {
    namespace: 'batchExportReportModal',
    state: {
        devices: [],
        records: [],
        caseName: '',
        eventName: ''
    },
    reducers,
    effects
};

export { BatchExportReportModalState };
export default model;