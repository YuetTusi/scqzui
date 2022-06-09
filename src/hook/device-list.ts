import { useEffect, useState } from "react";
import log from "@/utils/log";
import { getDb } from "@/utils/db";
import DeviceType from "@/schema/device-type";
import { TableName } from "@/schema/table-name";

/**
 * 读取设备数据
 * @param deviceId 设备id
 * @returns 若id不存在则返回null
 */
function useDevice(deviceId: string | undefined) {

    const db = getDb<DeviceType>(TableName.Devices);
    const [data, setData] = useState<DeviceType | null>(null);

    useEffect(() => {
        if (deviceId !== undefined) {
            (async () => {
                try {
                    const next = await db.findOne({ _id: deviceId });
                    setData(next);
                } catch (error) {
                    log.error(`读取设备失败 @hook/useDevice(deviceId=${deviceId}):${error.message}`);
                }
            })();
        }
    }, [deviceId]);

    return data;
}

export { useDevice };