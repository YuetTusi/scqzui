import React from 'react';
import dayjs from 'dayjs';
import Tag from 'antd/lib/tag';
import { ColumnProps } from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { FetchState } from '@/schema/device-state';
import { FetchLog } from '@/schema/fetch-log';

/**
 * 表头定义
 */
function getColumns(showHistoryHandle: (data: FetchLog) => void): ColumnProps<FetchLog>[] {
    const columns: ColumnProps<FetchLog>[] = [
        {
            title: '手机名称',
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(text: string, record: FetchLog) {
                if (helper.isNullOrUndefined(text)) {
                    return <span className="oneline">{text}</span>;
                } else {
                    return <span className="oneline">{text.split('_')[0]}</span>;
                }
            }
        },
        {
            title: '持有人',
            dataIndex: 'mobileHolder',
            key: 'mobileHolder',
            width: 140
        },
        {
            title: '手机编号',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: 75
        },
        {
            title: '案件名称',
            dataIndex: 'caseName',
            key: 'caseName',
            render(value: string, record: FetchLog) {
                return <span>{value ?? ''}</span>;
            }
        },
        {
            title: '备注',
            dataIndex: 'note',
            key: 'note'
            // width: 160
        },
        {
            title: '采集时间',
            dataIndex: 'fetchTime',
            key: 'fetchTime',
            width: 160,
            align: 'center',
            sorter(m: FetchLog, n: FetchLog) {
                return dayjs(m.createdAt).isAfter(n.createdAt) ? 1 : -1;
            },
            render(value: Date, record: FetchLog) {
                if (helper.isNullOrUndefined(record)) {
                    return null;
                } else {
                    return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>;
                }
            }
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            align: 'center',
            width: 60,
            render(value: FetchState) {
                switch (value) {
                    case FetchState.Finished:
                        return <Tag style={{ marginRight: 0 }} color="green">成功</Tag>;
                    case FetchState.HasError:
                        return <Tag style={{ marginRight: 0 }} color="red">异常</Tag>;
                    default:
                        return <Tag>完成</Tag>;
                }
            }
        },
        {
            title: '采集记录',
            dataIndex: 'record',
            key: 'record',
            align: 'center',
            width: 100,
            render(value: any, log: FetchLog) {
                return (
                    <a
                        onClick={() => {
                            showHistoryHandle(log);
                        }}>
                        采集记录
                    </a>
                );
            }
        },
        // {
        //     title: '删除',
        //     dataIndex: 'del',
        //     key: 'del',
        //     align: 'center',
        //     width: 60,
        //     render(value: any, log: FetchLog) {
        //         return (
        //             <a
        //                 onClick={() => {

        //                 }}>
        //                 删除
        //             </a>
        //         );
        //     }
        // }
    ];

    return columns;
}

export { getColumns };
