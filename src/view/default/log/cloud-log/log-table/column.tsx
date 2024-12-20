import dayjs from 'dayjs';
import React, { MouseEvent } from 'react';
import { Dispatch } from 'redux';
import { ColumnProps } from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { CloudLog } from '@/schema/cloud-log';

const { caseText, devText, fetchText } = helper.readConf()!;

/**
 * 表头定义
 */
function getColumns(dispatch: Dispatch): ColumnProps<CloudLog>[] {
    let cols: ColumnProps<CloudLog>[] = [
        {
            title: `${devText ?? '设备'}名称`,
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(val: string, record: CloudLog) {
                if (helper.isNullOrUndefined(val)) {
                    return '';
                } else {
                    let caseName = val.split('_')[0];
                    return <span>{caseName}</span>;
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
            title: '手机号',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
            align: 'center',
            width: 120,
            render(val?: string) {
                if (helper.isNullOrUndefined(val)) {
                    return '';
                } else {
                    return val;
                }
            }
        },
        {
            title: `${devText ?? '设备'}编号`,
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: 75,
            render(val?: string) {
                if (helper.isNullOrUndefined(val)) {
                    return '';
                } else {
                    return val;
                }
            }
        },
        {
            title: `${caseText ?? '案件'}名称`,
            dataIndex: 'caseName',
            key: 'caseName'
        },
        {
            title: '备注',
            dataIndex: 'note',
            key: 'note',
            // width: 140,
            render(val?: string) {
                if (helper.isNullOrUndefined(val)) {
                    return '';
                } else {
                    return val;
                }
            }
        },
        {
            title: `${fetchText ?? '取证'}时间`,
            dataIndex: 'fetchTime',
            key: 'fetchTime',
            width: 160,
            align: 'center',
            sorter(a, b) {
                let isAfter = dayjs(a.fetchTime).isAfter(dayjs(b.fetchTime));
                return isAfter ? 1 : -1;
            },
            render(fetchTime: Date) {
                if (helper.isNullOrUndefined(fetchTime)) {
                    return '';
                } else {
                    return dayjs(fetchTime).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        },
        {
            title: `${fetchText ?? '取证'}记录`,
            dataIndex: '_id',
            key: 'detail',
            width: 100,
            align: 'center',
            render(id: string, { apps }: CloudLog) {
                return <a
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.stopPropagation();
                        dispatch({ type: 'cloudLogModal/setVisible', payload: true });
                        dispatch({ type: 'cloudLogModal/setCloudApps', payload: apps });
                    }}>
                    {`${fetchText ?? '取证'}记录`}
                </a>;
            }
        }
    ];
    return cols;
}

export { getColumns };
