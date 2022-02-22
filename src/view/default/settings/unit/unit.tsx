import { useSubscribe } from '@/hook';
import { helper } from '@/utils/helper';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { MainBox } from '../styled/sub-layout';
import { UnitProp, UnitRecord } from './prop';

const Unit: FC<UnitProp> = () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
    const [currentPcsCode, setCurrentPcsCode] = useState<string | null>(null);
    const [data, setData] = useState<UnitRecord[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * 查询表格数据
     * @param keyword 关键字
     * @param pageIndex 页码（从1开始）
     */
    const queryUnitData = (keyword: string | null, pageIndex: number = 1, pageSize = 10) => {
        setLoading(true);
        ipcRenderer.send('query-db', keyword, pageIndex, pageSize);
    }

    useEffect(() => {
        queryUnitData(null, 1, helper.PAGE_SIZE);
    }, []);

    const queryDbHandle = (event: IpcRendererEvent, result: Record<string, any>) => {
        console.log(result);
    }



    useSubscribe('query-db-result', queryDbHandle);

    return <MainBox>
        Unit
    </MainBox>;
}

export default Unit;