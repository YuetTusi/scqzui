import React from 'react';
import { Dispatch } from "dva";
import CaseInfo from "@/schema/case-info";
import { ColumnsType, ColumnType } from "antd/lib/table";

/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getCaseColumns(dispatch: Dispatch): ColumnsType<CaseInfo> {
    let columns: ColumnType<CaseInfo>[] = [
        {
            title: '案件名称',
            dataIndex: 'm_strCaseName',
            key: 'm_strCaseName',
            render: (cell: string) => {
                return <div>{cell.includes('_') ? cell.split('_')[0] : cell}</div>;
            }
        }
    ];

    return columns;
}