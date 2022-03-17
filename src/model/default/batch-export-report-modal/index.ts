import { Model } from "dva";
import reducers from './reducers';
import effects from './effects';
import { DeviceType } from "@/schema/device-type";

interface BatchExportReportModalState {

    /**
     * 批量导出的案件id
     */
    devices: DeviceType[],
    /**
     * 当前案件名称
     */
    caseName: string
}

let model: Model = {
    namespace: 'batchExportReportModal',
    state: {
        devices: []
    },
    reducers,
    effects
};

export { BatchExportReportModalState };
export default model;