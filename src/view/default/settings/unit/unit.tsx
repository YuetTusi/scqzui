import debounce from 'lodash/debounce';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useRef, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import { Key } from 'antd/es/table/interface';
import message from 'antd/lib/message';
import { useSubscribe } from '@/hook';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { Organization } from '@/schema/organization';
import { Split } from '@/component/style-tool';
import { MainBox } from '../styled/sub-layout';
import { getColumns } from './columns';
import { UnitNameBox } from './styled/box';
import { UnitProp, UnitRecord } from './prop';

const { fetchText } = helper.readConf()!;
let selectPcsCode: string | undefined = undefined;
let selectPcsName: string | undefined = undefined;

const Unit: FC<UnitProp> = () => {

    const dispatch = useDispatch();
    const {
        collectUnitName,
        collectUnitCode
    } = useSelector<StateTree, Organization>(state => state.organization);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [data, setData] = useState<UnitRecord[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const inputRef = useRef<any>(null);

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
    }, []);

    /**
     * SQLite查询handle
     */
    const queryDbHandle = (event: IpcRendererEvent, result: Record<string, any>) => {
        setTotal(result.data.total);
        setData(result.data.rows);
        setLoading(false);
    }

    /**
     * 行选择Change
     * @param selectedRowKeys 行key
     * @param selectedRows 行数据
     */
    const rowSelectChange = (selectedRowKeys: Key[], selectedRows: UnitRecord[]) => {
        setSelectedRowKeys(selectedRowKeys);
        selectPcsCode = selectedRows[0].PcsCode;
        selectPcsName = selectedRows[0].PcsName;
    };

    /**
     * 查询Click
     */
    const onSearchClick = debounce((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (inputRef.current) {
            queryUnitData(inputRef.current.input.value, 1, 10);
        }
    }, 1500, { leading: true, trailing: false });

    /**
     * 保存Click
     */
    const onSaveClick = debounce((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (selectedRowKeys.length !== 0) {
            dispatch({
                type: 'organization/saveCollectUnit',
                payload: {
                    collectUnitCode: selectPcsCode,
                    collectUnitName: selectPcsName
                }
            });
        } else {
            message.info(`请选择${fetchText ?? '取证'}单位`);
        }
    }, 500, { leading: true, trailing: false });

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
    const onPageChange = (pageIndex: number) => {
        let value = inputRef.current?.input?.value;
        setSelectedRowKeys([]);
        setPageIndex(pageIndex);
        queryUnitData(value ?? null, pageIndex, 10);
    };

    /**
     * 行Click
     */
    const onRowClick = ({ PcsCode, PcsName }: UnitRecord) => {
        setSelectedRowKeys([PcsCode]);
        selectPcsCode = PcsCode;
        selectPcsName = PcsName;
    };

    useSubscribe('query-db-result', queryDbHandle);

    return <MainBox>
        <UnitNameBox>
            <div className="info-bar">
                <em
                    title={collectUnitCode ? `单位编号：${collectUnitCode}` : ''}>
                    {collectUnitName ? collectUnitName : '未设置单位'}
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
            onRow={(record) => ({
                onClick: () => onRowClick(record)
            })}
            rowSelection={{
                type: 'radio',
                onChange: rowSelectChange,
                selectedRowKeys: selectedRowKeys
            }}>
        </Table>
    </MainBox>;
}

export default Unit;