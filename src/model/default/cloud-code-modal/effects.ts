import { AnyAction } from 'redux';
import { EffectsCommandMap } from "dva";
import logger from "@/utils/log";
import { helper } from "@/utils/helper";
import { getDb } from "@/utils/db";
import { caseStore } from "@/utils/local-store";
import { StateTree } from '@/type/model';
import { TableName } from "@/schema/table-name";
import DeviceType from "@/schema/device-type";
import { CloudAppMessages } from "@/schema/cloud-app-messages";

export default {
    /**
     * 保存云取证日志
     * @param {number} payload.usb 序号
     */
    *saveCloudLog({ payload }: AnyAction, { fork, select }: EffectsCommandMap) {
        const db = getDb(TableName.CloudLog);
        const { usb } = payload as { usb: number };
        const { device, cloudCodeModal } = yield select((state: StateTree) => ({
            device: state.device,
            cloudCodeModal: state.cloudCodeModal
        }));
        const currentDevice = device.deviceList[usb - 1] as DeviceType;
        const currentMessage = cloudCodeModal.devices[usb - 1] as { apps: CloudAppMessages[] };
        const { caseName, spareName } = caseStore.get(usb);

        if (currentDevice) {
            try {
                yield fork([db, 'insert'], {
                    mobileName: currentDevice.mobileName,
                    mobileHolder: currentDevice.mobileHolder,
                    mobileNumber: currentDevice.mobileNumber,
                    mobileNo: currentDevice.mobileNo ?? '',
                    fetchTime: new Date(),
                    note: currentDevice.note ?? '',
                    apps: currentMessage?.apps ?? [],
                    caseName: helper.isNullOrUndefinedOrEmptyString(spareName) ? caseName.split('_')[0] : spareName
                });
            } catch (error) {
                logger.error(`写入云取证日志失败 @model/default/cloud-code-modal/*saveCloudLog:${error.message}`);
            }
        } else {
            logger.warn(`未写入云取证日志，设备数据为空 usb:#${usb}`);
        }
    }
};