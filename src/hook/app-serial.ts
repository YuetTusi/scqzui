import { join } from 'path';
import { readFile } from 'fs/promises';
import { useState } from 'react';
import log from '@/utils/log';
import { helper } from '@/utils/helper';

/**
 * 读取软件序列号
 */
function useAppSerial() {

    const [appSerial, setAppSerial] = useState<string>('');
    const serialPath = join(helper.APP_CWD, '../update/__hardware__.txt');

    try {
        (async () => {
            const exist = await helper.existFile(serialPath);
            if (exist) {
                const chunk = await readFile(serialPath, { encoding: 'utf8' });
                setAppSerial(chunk);
            }
        })();
    } catch (error) {
        log.error(`序列号文件读取失败(__hardware__):${error.message}`);
        setAppSerial('');
    }

    return appSerial;
}

export { useAppSerial };