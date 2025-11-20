import { useEffect, useState } from 'react';
import { getDb } from '@/utils/db';
import log from '@/utils/log';
import { Organization } from '@/schema/organization';
import { TableName } from '@/schema/table-name';


/**
 * 获取采集单位名称及编码
 */
export const useUnit = (): [string | undefined, string | undefined] => {

    const db = getDb<Organization>(TableName.Organization);
    const [collectUnit, setCollectUnit] = useState<[string | undefined, string | undefined]>([undefined, undefined]);

    useEffect(() => {
        try {
            (async () => {
                const next: Organization[] = await db.all();
                if (next.length === 0) {
                    setCollectUnit([undefined, undefined]);
                } else {
                    setCollectUnit([next[0].collectUnitCode, next[0].collectUnitName]);
                }
            })()
        } catch (error) {
            log.error(`查询采集单位失败 @src/hook/unit.ts:${error.message}`);
        }
    }, []);

    return collectUnit;
}

/**
 * 获取目的检验单位名称及编码
 */
export const useDstUnit = (): [string | undefined, string | undefined] => {
    const db = getDb<Organization>(TableName.Organization);
    const [dstUnit, setDstUnit] = useState<[string | undefined, string | undefined]>([undefined, undefined]);

    useEffect(() => {
        try {
            (async () => {
                const next: Organization[] = await db.all();
                if (next.length === 0) {
                    setDstUnit([undefined, undefined]);
                } else {
                    setDstUnit([next[0].dstUnitCode, next[0].dstUnitName]);
                }
            })()
        } catch (error) {
            log.error(`查询目的检验单位失败 @src/hook/unit.ts:${error.message}`);
        }
    }, []);

    return dstUnit;
}