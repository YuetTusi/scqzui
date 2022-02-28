import DeviceSystem from "@/schema/device-system";
import { DeviceType } from "@/schema/device-type";

interface CollectProp { };

interface DeviceFrameProp {
    /**
     * 帮助handle
     */
    onHelpHandle: (arg0: DeviceSystem) => void,
    /**
     * 标准取证
     */
    onNormalHandle: (arg0: DeviceType) => void,
    /**
     * 云取证
     */
    onServerCloudHandle: (arg0: DeviceType) => void,
};

interface FetchButtonProp {
    /**
     * 设备
     */
    device: DeviceType,
    /**
     * 帮助handle
     */
    onHelpHandle: (arg0: DeviceSystem) => void,
    /**
     * 标准取证handle
     */
    onNormalHandle: (arg0: DeviceType) => void,
    /**
     * 云取证handle
     */
    onServerCloudHandle: (arg0: DeviceType) => void,
    /**
     * 停止采集handle
     */
    onStopHandle: (arg0: DeviceType) => void
}

interface MobileInfoProp {
    /**
     * 设备
     */
    device: DeviceType,
}

export { CollectProp, DeviceFrameProp, FetchButtonProp, MobileInfoProp };