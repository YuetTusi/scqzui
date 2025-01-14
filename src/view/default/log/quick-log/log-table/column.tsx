import React from 'react';
import dayjs from 'dayjs';
import { ColumnProps } from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { QuickLog } from '@/schema/quick-log';

const { caseText, devText, fetchText } = helper.readConf()!;

/**
 * 表头定义
 */
function getColumns(): ColumnProps<QuickLog>[] {
    const columns: ColumnProps<QuickLog>[] = [
        {
            title: `${devText ?? '设备'}名称`,
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(text: string, record: QuickLog) {
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
            title: `${devText ?? '设备'}编号`,
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: 80
        },
        {
            title: `${caseText ?? '案件'}名称`,
            dataIndex: 'caseName',
            key: 'caseName',
            render(value: string) {
                if (helper.isNullOrUndefined(value)) {
                    return <span className="oneline">{value}</span>;
                } else {
                    return <span className="oneline">{value.split('_')[0]}</span>;
                }
            }
        },
        {
            title: `${fetchText ?? '取证'}时间`,
            dataIndex: 'fetchTime',
            key: 'fetchTime',
            width: 160,
            align: 'center',
            sorter(m: QuickLog, n: QuickLog) {
                return dayjs(m.createdAt).isAfter(n.createdAt) ? 1 : -1;
            },
            render(value: Date, record: QuickLog) {
                if (helper.isNullOrUndefined(record)) {
                    return null;
                } else {
                    return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>;
                }
            }
        }
    ];

    return columns;
}

export { getColumns };
