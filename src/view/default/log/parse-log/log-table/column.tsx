import dayjs from 'dayjs';
import { Dispatch } from 'dva';
import React from 'react';
import Tag from 'antd/lib/tag';
import { ColumnProps } from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { ParseState } from '@/schema/device-state';
import ParseLog from '@/schema/parse-log';

const { caseText, devText, parseText } = helper.readConf()!;

/**
 * 表头定义
 */
function getColumns(dispatch: Dispatch): ColumnProps<ParseLog>[] {
    let cols: ColumnProps<ParseLog>[] = [
        {
            title: `${devText ?? '设备'}名称`,
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(val: string, record: ParseLog) {
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
            title: `${parseText ?? '解析'}开始时间`,
            dataIndex: 'startTime',
            key: 'startTime',
            width: 160,
            align: 'center',
            sorter(a, b) {
                let isAfter = dayjs(a.startTime).isAfter(dayjs(b.startTime));
                return isAfter ? 1 : -1;
            },
            render(startTime?: Date) {
                if (helper.isNullOrUndefined(startTime)) {
                    return '';
                } else {
                    return dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        },
        {
            title: `${parseText ?? '解析'}完成时间`,
            dataIndex: 'endTime',
            key: 'endTime',
            width: 160,
            align: 'center',
            sorter(a, b) {
                let isAfter = dayjs(a.endTime).isAfter(dayjs(b.endTime));
                return isAfter ? 1 : -1;
            },
            render(endTime?: Date) {
                if (helper.isNullOrUndefined(endTime)) {
                    return '';
                } else {
                    return dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: 70,
            align: 'center',
            render(state: ParseState, record: ParseLog) {
                switch (state) {
                    case ParseState.NotParse:
                        return <Tag color="silver" style={{ marginRight: 0 }}>
                            {`未${parseText ?? '解析'}`}
                        </Tag>;
                    case ParseState.Parsing:
                        return <Tag color="blue" style={{ marginRight: 0 }}>
                            {`${parseText ?? '解析'}中`}
                        </Tag>;
                    case ParseState.Finished:
                        return <Tag color="green" style={{ marginRight: 0 }}>
                            完成
                        </Tag>;
                    case ParseState.Error:
                        return <Tag color="red" style={{ marginRight: 0 }}>
                            失败
                        </Tag>;
                }
            }
        },
        // {
        //     title: '删除',
        //     dataIndex: '_id',
        //     key: 'del',
        //     width: 70,
        //     align: 'center',
        //     render(id: string) {
        //         return (
        //             <a
        //                 onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        //                     e.stopPropagation();
        //                     Modal.confirm({
        //                         title: '删除确认',
        //                         content: '日志将删除，确认吗？',
        //                         okText: '确定',
        //                         cancelText: '取消',
        //                         onOk() {
        //                             dispatch({ type: 'parseLog/dropById', payload: id });
        //                         }
        //                     });
        //                 }}>
        //                 删除
        //             </a>
        //         );
        //     }
        // }
    ];
    return cols;
}

export { getColumns };
