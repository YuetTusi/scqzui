import React, { MouseEvent } from 'react';
import { Dispatch } from 'redux';
import dayjs from 'dayjs';
import Modal from 'antd/lib/modal';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { FetchData } from '@/schema/fetch-data';

/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getColumns(dispatch: Dispatch, onAction: (action: string, data: FetchData) => void): ColumnsType<FetchData> {
    const columns: ColumnType<FetchData>[] = [
        {
            title: '序列号',
            dataIndex: 'serial',
            key: 'serial'
        },
        {
            title: '手机名称',
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(val: string) {
                const [caseName] = val.split('_');
                return <span>{caseName}</span>;
            }
        },
        {
            title: '姓名',
            dataIndex: 'mobileHolder',
            key: 'mobileHolder'
        },
        {
            title: '身份证/军官证号',
            dataIndex: 'credential',
            key: 'credential'
        },
        {
            title: '设备手机号',
            dataIndex: 'note',
            key: 'note'
        },
        {
            title: '手机编号',
            dataIndex: 'mobileNo',
            key: 'mobileNo'
        },
        {
            title: '点验时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '160px',
            align: 'center',
            render(val: Date) {
                return <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }
        },
        {
            title: '编辑',
            dataIndex: 'serial',
            key: 'serial',
            width: '60px',
            align: 'center',
            render: (val: string, record: FetchData) => <a
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
                    onAction('edit', record);
                }}>
                编辑
            </a>
        },
        {
            title: '删除',
            key: 'serial',
            width: '60px',
            align: 'center',
            render: (val: string, record: FetchData) => <a
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    Modal.confirm({
                        title: '删除',
                        content: `删除序列号为「${record.serial}」的数据？`,
                        okText: '是',
                        cancelText: '否',
                        centered: true,
                        onOk() {
                            onAction('del', record);
                        }
                    });
                }}>
                删除
            </a>
        }
    ];
    return columns;
}
