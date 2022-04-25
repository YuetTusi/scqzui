
import { useState, useEffect } from 'react';
import { getDb } from '@/utils/db';
import { QuickEvent } from '@/schema/quick-event';
import { TableName } from '@/schema/table-name';


/**
 * 查询快速点验案件
 * @param id ID
 */
function useQuickEvent(id: string) {

    const [data, setData] = useState<QuickEvent | null>(null);

    useEffect(() => {
        const db = getDb<QuickEvent>(TableName.QuickEvent);
        (async () => {
            try {
                const next = await db.findOne({ _id: id });
                setData(next);
            } catch (error) {
                console.warn(error);
                setData(null);
            }
        })();
    }, [id]);
    return data;
}

export { useQuickEvent };