import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import Button from 'antd/lib/button';
import CaseInfo from "@/schema/case-info";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { OperateDoingState } from '@/model/default/operate-doing';

const { Group } = Button;

/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getCaseColumns(
    dispatch: Dispatch,
    operateDoing: OperateDoingState,
    setBatchExportReportModalVisible: (visible: boolean) => void
): ColumnsType<CaseInfo> {
    let columns: ColumnType<CaseInfo>[] = [
        {
            title: '案件名称',
            dataIndex: 'm_strCaseName',
            key: 'm_strCaseName',
            render: (value: string) => {
                return <div>{value.includes('_') ? value.split('_')[0] : value}</div>;
            }
        }, {
            title: '批量导出',
            dataIndex: '_id',
            key: '_id',
            width: 50,
            align: 'center',
            render: (id: string) => {
                const { exportingDeviceId } = operateDoing;
                return <div>
                    <Group size="small">
                        <Button
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                dispatch({
                                    type: 'batchExportReportModal/queryDevicesByCaseId',
                                    payload: id
                                });
                                setBatchExportReportModalVisible(true);
                            }}
                            disabled={exportingDeviceId.length !== 0}
                            type="primary">
                            报告
                        </Button>
                        <Button type="primary">BCP</Button>
                    </Group>
                </div>;
            }
        }
    ];

    return columns;
}