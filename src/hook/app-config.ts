import { join } from 'path';
import { useEffect, useState } from 'react';
import { AppJson } from '@/schema/app-json';
import { helper } from '@/utils/helper';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';

/**
 * 读取app.json配置
 */
function useAppConfig() {
    const target: string = isDev
        ? join(cwd, 'data/app.json')
        : join(cwd, 'resources/config/app.json');
    const [data, setData] = useState<AppJson | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const exist = await helper.existFile(target);
                if (exist) {
                    const next = await helper.readAppJson();
                    setData(next);
                } else {
                    setData(null);
                }
            } catch (error) {
                console.warn(error);
                setData(null);
            }
        })();
    }, []);
    return data;
}

export { useAppConfig };