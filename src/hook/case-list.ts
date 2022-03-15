import { useState, useEffect } from 'react';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import CaseInfo from '@/schema/case-info';
import { TableName } from '@/schema/table-name';

/**
 * 读取全部案件数据
 */
function useCaseList() {

    const db = getDb<CaseInfo>(TableName.Case);
    const [data, setData] = useState<CaseInfo[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const next = await db.find(null, 'createdAt', -1);
                console.log('---------next----------')
                console.log(next);
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