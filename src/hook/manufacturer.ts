import { useEffect, useState } from 'react';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { Manufaturer } from '@/schema/manufaturer';

/**
 * 读取软硬件配置
 */
const useManufacturer = () => {

    const [data, setData] = useState<Manufaturer | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const next = await helper.readManufaturer();
                setData(next);
            } catch (error) {
                log.error(`读取Manufacturer.json失败:${error.message}`);
                setData(null);
            }
        })();
    }, []);

    return data;
};

export { useManufacturer };