import { useState, useEffect } from 'react';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import CaseInfo from '@/schema/case-info';
import { TableName } from '@/schema/table-name';

/**
 * 读取全部案件数据
 */
function useCaseList() {

    const db = getDb<CaseInfo>(TableName.Cases);
    const [data, setData] = useState<CaseInfo[]>([]);

    useEffect(() => {
        (async () => {
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

/**
 * 读取案件数据
 * @param caseId 案件id
 * @returns 若id不存在则返回null
 */
function useCase(caseId: string | undefined) {

    const db = getDb<CaseInfo>(TableName.Cases);
    const [data, setData] = useState<CaseInfo | null>(null);

    useEffect(() => {
        if (caseId !== undefined) {
            (async () => {
                try {
                    const next = await db.findOne({ _id: caseId });
                    setData(next);
                } catch (error) {
                    log.error(`读取案件失败 @hook/useCase(caseId=${caseId}):${error.message}`);
                }
            })();
        }
    }, [caseId]);

    return data;
}

export { useCaseList, useCase };