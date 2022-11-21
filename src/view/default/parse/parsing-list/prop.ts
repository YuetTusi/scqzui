import DeviceType from "@/schema/device-type";
import ParseDetail from "@/schema/parse-detail";

/**
 * 属性
 */
export interface ParsingDevProp {
    /**
     * 详情信息
     */
    info?: ParseDetail,
    /**
     * 设备
     */
    devices: DeviceType[]
}

export interface ParsingListProp { }