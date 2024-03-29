import React from 'react';
import { ColumnsType } from 'antd/lib/table';

/**
 * 表头定义
 */
export function getColumns(): ColumnsType<any> {
    let columns: any = [
        {
            title: '检验单位',
            dataIndex: 'PcsName',
            key: 'PcsName',
            render(val: string) {
                if (val) {
                    return <span>{val.trim()}</span>;
                } else {
                    return null;
                }
            }
        },
        {
            title: '单位编号',
            dataIndex: 'PcsCode',
            key: 'PcsCode',
            width: 140,
            align: 'center',
            render(value: string) {
                if (value.startsWith('USR')) {
                    //单位编号以`USR`开头是用户自行维护的单位，不显示编号
                    return <span>▪▪▪▪▪▪▪▪▪▪▪▪</span>;
                } else {
                    return <span>{value}</span>;
                }
            }
        }
    ];
    return columns;
}
