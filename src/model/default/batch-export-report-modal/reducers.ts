import { AnyAction } from "redux";
import { BatchExportReportModalState } from ".";

export default {
    setCaseName(state: BatchExportReportModalState, { payload }: AnyAction) {
        state.caseName = payload;
        return state;
    },
    setDevices(state: BatchExportReportModalState, { payload }: AnyAction) {
        // console.log(payload);
        state.devices = payload;
        return state;
    }
}