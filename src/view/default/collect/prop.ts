import DeviceSystem from "@/schema/device-system";
import { DeviceType } from "@/schema/device-type";

interface CollectProp { };

interface DeviceFrameProp {
    /**
     * 帮助handle
     */
    onHelpHandle: (arg0: DeviceSystem) => void
};

interface FetchButtonProp {

    /**
     * 设备
     */
    device: DeviceType,
    /**
     * 帮助handle
     */
    onHelpHandle: (arg0: DeviceSystem) => void
}

interface MobileInfoProp {
    /**
     * 设备
     */
    device: DeviceType,
}

export { CollectProp, DeviceFrameProp, FetchButtonProp, MobileInfoProp };