import { useEffect, useState } from 'react';
import { AppJson } from '@/schema/app-json';
import { helper } from '@/utils/helper';

/**
 * 读取app.json配置
 */
function useAppConfig() {
    const [data, setData] = useState<AppJson | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const next = await helper.readAppJson();
                setData(next);
            } catch (error) {
                console.warn(error);
            }
        })();
    }, []);
    return data;
}

export { useAppConfig };