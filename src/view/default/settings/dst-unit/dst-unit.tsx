import debounce from 'lodash/debounce';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useRef, useState, MouseEvent } from 'react';
import { useDispatch, useSelector, useLocation } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import { Key } from 'antd/es/table/interface';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { useSubscribe } from '@/hook';
import { Organization } from '@/schema/organization';
import { Split } from '@/component/style-tool';
import { MainBox } from '../styled/sub-layout';
import { getColumns } from './columns';
import { UnitNameBox } from './styled/box';
import { UnitProp, UnitRecord } from './prop';
import { ClearKey } from '../unit';
import Auth from '@/component/auth';

let selectPcsCode: string | undefined = undefined;
let selectPcsName: string | undefined = undefined;

/**
 * 目的检验单位
 */
const DstUnit: FC<UnitProp> = () => {

    const dispatch = useDispatch();
    const {
        dstUnitName,
        dstUnitCode
    } = useSelector<StateTree, Organization>(state => state.organization);
    const { search } = useLocation<{ admin: string }>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [data, setData] = useState<UnitRecord[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const inputRef = useRef<any>(null);

    useEffect(() => {
        const sp = new URLSearchParams(search);
        setIsAdmin(sp.get('admin') === '1');
    }, [search]);

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
     * @param selectedRowKeys 选中的key
     * @param selectedRows 选中行数据
     */
    const rowSelectChange = (selectedRowKeys: Key[], selectedRows: UnitRecord[]) => {
        setSelectedRowKeys(selectedRowKeys);
        selectPcsCode = selectedRows[0].PcsCode;
        selectPcsName = selectedRows[0].PcsName;
    };

    /**
     * 行Click
     */
    const onRowClick = ({ PcsCode, PcsName }: UnitRecord) => {
        setSelectedRowKeys([PcsCode]);
        selectPcsCode = PcsCode;
        selectPcsName = PcsName;
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
            console.log(selectPcsCode, selectPcsName);
            dispatch({
                type: 'organization/saveDstUnit',
                payload: {
                    dstUnitCode: selectPcsCode,
                    dstUnitName: selectPcsName
                }
            });
        } else {
            message.destroy();
            message.info('请选择目的检验单位');
        }
    }, 500, { leading: true, trailing: false })

    /**
     * 清除Click
     */
    const onClearClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        Modal.confirm({
            onOk() {
                dispatch({ type: 'organization/clear', payload: ClearKey.Dst });
            },
            okText: '是',
            cancelText: '否',
            title: '清除',
            content: '确认清除当前单位设置？',
            centered: true
        });
    };

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
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
                    title={dstUnitCode ? `单位编号：${dstUnitCode}` : ''}>
                    {dstUnitName ? dstUnitName : '未设置单位'}
                </em>
            </div>
            <div className="btn-box">
                <label>单位名称：</label>
                <Input ref={inputRef} style={{ width: '160px' }} placeholder="请输入单位名称查询" />
                <Button onClick={onSearchClick} type="primary">
                    <SearchOutlined />
                    <span>查询</span>
                </Button>
                <Button onClick={onSaveClick} type="primary">
                    <CheckCircleOutlined />
                    <span>保存</span>
                </Button>
                <Auth deny={!isAdmin}>
                    <Button onClick={onClearClick} type="primary" danger={true}>
                        <DeleteOutlined />
                        <span>清除</span>
                    </Button>
                </Auth>
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

export default DstUnit;