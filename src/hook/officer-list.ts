import { useEffect, useState } from 'react';
import { getDb } from '@/utils/db';
import { TableName } from '@/schema/table-name';
import { Officer } from '@/schema/officer';

function useOfficerList() {
    const db = getDb<Officer>(TableName.Officer);
    const [officer, setOfficer] = useState<Officer[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const next = await db.find(null, 'createdAt', -1);
                setOfficer(next);
            } catch (error) {
                setOfficer([]);
            }
        })();
    }, []);

    return officer;
}

export { useOfficerList };