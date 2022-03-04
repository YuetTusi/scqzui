import { useEffect, useState } from 'react';
import { TableName } from '@/schema/table-name';
import { Officer } from '@/schema/officer';
import { Db } from '@/utils/db';

function useOfficerList() {
    const db = new Db<Officer>(TableName.Officer);
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