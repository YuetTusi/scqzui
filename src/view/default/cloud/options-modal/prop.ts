import { CloudApp, FetchOption } from "@/schema/cloud-app";

export interface OptionsModalProp {

    /**
     * 显示
     */
    visible: boolean,
    /**
     * 云取应用
     */
    app: CloudApp,
    /**
     * 确定handle
     */
    onSave: (data: FetchOption) => void,
    /**
     * 取消handle
     */
    onCancel: () => void
}

export interface FormValue extends FetchOption {

    /**
     * 起始时间
     */
    startTime: Date,
    /**
     * 结束时间
     */
    endTime: Date,
}