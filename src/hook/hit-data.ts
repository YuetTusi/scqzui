import { join } from 'path';
import { useEffect, useState } from 'react';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { QuickRecord } from '@/schema/quick-record';
import { DeviceType } from '@/schema/device-type';

/**
 * 读取设备命中数量
 * @param {DeviceType} data 快速点验设备
 */
export const useHitCount = (data: DeviceType) => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (helper.isNullOrUndefined(data)) {
            setCount(0);
        } else {
            (async () => {
                const target = join(data.phonePath!, './out/KeywordSearch_Rcount.json');
                try {
                    const exist = await helper.existFile(target);
                    if (exist) {
                        const next = await helper.readJSONFile(target);
                        setCount(next.totalcount ?? 0);
                    }
                } catch (error) {
                    setCount(0);
                    log.error(`读取设备命中数量失败 @hook/hit-data/useHitCount:${error.message}`);
                }
            })();
        }
    }, [data]);

    return count;
}


/**
 * 读取设备命中数据（饼图数据）
 * @param {DeviceType} record 设备
 */
export const useHitData = (record: DeviceType) => {

    const [data, setData] = useState<Record<string, any>>();

    useEffect(() => {
        if (helper.isNullOrUndefined(record)) {
            setData(undefined);
        } else {
            (async () => {
                const target = join(record!.phonePath ?? '', './out/KeywordSearch_Rcount.json');
                try {
                    const exist = await helper.existFile(target);
                    if (exist) {
                        let next = await helper.readJSONFile(target);
                        setData({
                            ...next,
                            items: (next?.items ?? []).filter((item: { name: string, value: number }) => item.value !== 0),
                        });
                    } else {
                        setData(undefined);
                    }
                } catch (error) {
                    setData(undefined);
                    log.error(`读取设备命中数量失败 @hook/hit-data/useHitData:${error.message}`);
                }
            })();
        }
    }, [record]);

    return data;
}

/**
 * 读取快速点验命中数量
 * @param {QuickRecord} data 快速点验设备
 */
export const useQuickHitCount = (data: QuickRecord) => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (helper.isNullOrUndefined(data)) {
            setCount(0);
        } else {
            (async () => {
                const target = join(data.phonePath!, './out/KeywordSearch_Rcount.json');
                try {
                    const exist = await helper.existFile(target);
                    if (exist) {
                        const next = await helper.readJSONFile(target);
                        setCount(next.totalcount ?? 0);
                    }
                } catch (error) {
                    setCount(0);
                    log.error(`读取点验命中数量失败 @hook/hit-data/useQuickHitCount:${error.message}`);
                }
            })();
        }
    }, [data]);

    return count;
}

/**
 * 读取快速点验命中数据（饼图数据）
 * @param {QuickRecord} record 快速点验设备
 */
export const useQuickHit = (record: QuickRecord) => {

    const [data, setData] = useState<Record<string, any>>();

    useEffect(() => {
        if (helper.isNullOrUndefined(record)) {
            setData(undefined);
        } else {
            (async () => {
                const target = join(record!.phonePath ?? '', './out/KeywordSearch_Rcount.json');
                try {
                    const exist = await helper.existFile(target);
                    if (exist) {
                        let next = await helper.readJSONFile(target);
                        setData({
                            ...next,
                            items: (next?.items ?? []).filter((item: { name: string, value: number }) => item.value !== 0),
                        });
                    } else {
                        setData(undefined);
                    }
                } catch (error) {
                    setData(undefined);
                    log.error(`读取点验命中数量失败 @hook/hit-data/useQuickHit:${error.message}`);
                }
            })();
        }
    }, [record]);

    return data;
}