import { join } from 'path';
import debounce from 'lodash/debounce';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useRef, useState, MouseEvent } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import { Key } from 'antd/es/table/interface';
import message from 'antd/lib/message';
import log from '@/utils/log';
import { useSubscribe } from '@/hook';
import { helper } from '@/utils/helper';
import { LocalStoreKey } from '@/utils/local-store';
import { Split } from '@/component/style-tool';
import { MainBox } from '../styled/sub-layout';
import { getColumns } from './columns';
import { UnitNameBox } from './styled/box';
import { UnitProp, UnitRecord } from './prop';


const config = helper.readConf();
let jsonSavePath = ''; //JSON文件路径
if (process.env['NODE_ENV'] === 'development') {
    jsonSavePath = join(process.cwd(), './data/unit.json');
} else {
    jsonSavePath = join(process.cwd(), '../data/unit.json');
}
let selectPcsCode: string | null = null;
let selectPcsName: string | null = null;

/**
 * 目的检验单位
 */
const DstUnit: FC<UnitProp> = () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [currentPcsCode, setCurrentPcsCode] = useState<string | null>(null);
    const [currentPcsName, setCurrentPcsName] = useState<string | null>(null);
    const [data, setData] = useState<UnitRecord[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const inputRef = useRef<Input>(null);

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
        queryUnitData(null, 1, 10);
        setCurrentPcsCode(localStorage.getItem(LocalStoreKey.UnitCode));
        setCurrentPcsName(localStorage.getItem(LocalStoreKey.DstUnitName));
    }, []);

    const queryDbHandle = (event: IpcRendererEvent, result: Record<string, any>) => {
        setTotal(result.data.total);
        setData(result.data.rows);
        setLoading(false);
    }

    /**
 * 写入JSON文件
 * @param DstUnitName 采集单位名称
 * @param unitCode 采集单位编号
 */
    const writeJson = (DstUnitName: string | null, unitCode: string | null) => {
        let dstUnitCode = localStorage.getItem(LocalStoreKey.DstUnitCode);
        let dstDstUnitName = localStorage.getItem(LocalStoreKey.DstUnitName);
        helper
            .writeJSONfile(jsonSavePath, {
                customUnit: config?.useBcp ? 0 : 1, //非BCP版本使用自定义单位1
                DstUnitName,
                unitCode,
                dstDstUnitName,
                dstUnitCode
            })
            .catch((err) => {
                log.error(`写入JSON文件失败 @view/default/settings/unit: ${err.message}`);
            });
    };

    const rowSelectChange = (selectedRowKeys: Key[], selectedRows: UnitRecord[]) => {
        setSelectedRowKeys(selectedRowKeys);
        selectPcsCode = selectedRows[0].PcsCode;
        selectPcsName = selectedRows[0].PcsName;
    };

    const onSearchClick = debounce((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (inputRef.current) {
            queryUnitData(inputRef.current.input.value, 1, 10);
        }
    }, 1500, { leading: true, trailing: false });

    const onSaveClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (selectedRowKeys.length !== 0) {
            localStorage.setItem(LocalStoreKey.DstUnitName, selectPcsName!);
            localStorage.setItem(LocalStoreKey.DstUnitCode, selectPcsCode!);
            message.destroy();
            message.success('保存成功');
            setCurrentPcsCode(selectPcsCode);
            setCurrentPcsName(selectPcsName);
            writeJson(selectPcsName, selectPcsCode);
        } else {
            message.destroy();
            message.info('请选择目的检验单位');
        }
    }

    const onPageChange = (pageIndex: number) => {
        let value = inputRef.current?.input?.value;
        setSelectedRowKeys([]);
        setPageIndex(pageIndex);
        queryUnitData(value ?? null, pageIndex, 10);
    }

    useSubscribe('query-db-result', queryDbHandle);

    return <MainBox>
        <UnitNameBox>
            <div className="info-bar">
                <em
                    title={currentPcsCode ? `单位编号：${currentPcsCode}` : ''}>
                    {currentPcsName ? currentPcsName : '未设置单位'}
                </em>
            </div>
            <div className="btn-box">
                <label>单位名称：</label>
                <Input ref={inputRef} placeholder="请输入单位名称查询" />
                <Button onClick={onSearchClick} type="primary">
                    <SearchOutlined />
                    <span>查询</span>
                </Button>
                <Button onClick={onSaveClick} type="primary">
                    <CheckCircleOutlined />
                    <span>保存</span>
                </Button>
            </div>
        </UnitNameBox>
        <Split />
        <Table<UnitRecord>
            dataSource={data}
            loading={loading}
            pagination={{
                pageSize: 10,
                current: pageIndex,
                total,
                onChange: onPageChange,
                showSizeChanger: false
            }}
            columns={getColumns()}
            rowKey={(record) => record.PcsCode}
            rowSelection={{
                type: 'radio',
                onChange: rowSelectChange,
                selectedRowKeys: selectedRowKeys
            }}>

        </Table>
    </MainBox>;
}

export default DstUnit;