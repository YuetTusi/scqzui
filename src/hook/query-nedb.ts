import { getDb } from '@/utils/db';
import { useEffect, useState } from 'react';

/**
 * 查询本地NeDB数据库
 * @param {TableName} tableName 表名
 * @param {any} condition 查询条件
 */
function useQueryDb(tableName: string, condition: any = null) {

    const [result, setResult] = useState<any>(null);
    const db = getDb(tableName);

    useEffect(() => {
        (async function () {
            let data = await db.find(condition);
            setResult(data);
        })();
    }, []);

    return result;
}

export { useQueryDb };