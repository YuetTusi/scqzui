import { useEffect, useState } from 'react';
import log from '@/utils/log';
import { Db } from '@/utils/db';
import CaseInfo from '@/schema/case-info';
import { TableName } from '@/schema/table-name';

/**
 * 读取全部案件数据
 */
function useCaseList() {

    const [data, setData] = useState<CaseInfo[]>([]);

    useEffect(() => {
        (async () => {
            const db = new Db<CaseInfo>(TableName.Case);
            try {
                const next = await db.find(null, 'createdAt', -1);
                setData(next);
            } catch (error) {
                log.error(`读取案件列表失败 @hook/useCaseList:${error.message}`);
                setData([]);
            }
        })();
    }, []);

    return data;
}

export { useCaseList };