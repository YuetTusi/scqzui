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

function useOfficer(id: string) {

    const db = getDb<Officer>(TableName.Officer);
    const [officer, setOfficer] = useState<Officer | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const next = await db.findOne({ _id: id });
                setOfficer(next);
            } catch (error) {
                setOfficer(null);
            }
        })();
    }, [id]);

    return officer;
}

export { useOfficerList, useOfficer };