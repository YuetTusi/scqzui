import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import { ColumnsType, ColumnType } from "antd/lib/table";
import Button from 'antd/lib/button';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import CaseInfo from "@/schema/case-info";
import { OperateDoingState } from '@/model/default/operate-doing';
import { NoWrapText } from './styled/style';

const { Group } = Button;
const { useBcp } = helper.readConf()!;

/**
 * 表头定义
 * @param dispatch 派发方法
 * @param operateDoing OperateDoing仓库
 * @param setBatchExportReportModalVisible 显示/隐藏批量导出handle
 */
export function getCaseColumns(
    dispatch: Dispatch,
    operateDoing: OperateDoingState,
    setBatchExportReportModalVisible: (visible: boolean) => void,
    setExportBcpModalVisible: (visible: boolean) => void
): ColumnsType<CaseInfo> {
    let columns: ColumnType<CaseInfo>[] = [
        {
            title: '案件名称',
            dataIndex: 'm_strCaseName',
            key: 'm_strCaseName',
            render: (value: string) => {
                const txt = value.includes('_') ? value.split('_')[0] : value;
                return <NoWrapText title={txt}>{txt}</NoWrapText>;
            }
        }, {
            title: '导出',
            dataIndex: '_id',
            key: '_id',
            width: 60,
            align: 'center',
            render: (id: string, record: CaseInfo) => {
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
                        <Auth deny={!useBcp}>
                            <Button onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                dispatch({ type: 'exportBcpModal/setIsBatch', payload: true });
                                dispatch({ type: 'exportBcpModal/setExportBcpCase', payload: record });
                                setExportBcpModalVisible(true);
                            }} type="primary">
                                BCP
                            </Button>
                        </Auth>

                    </Group>
                </div>;
            }
        }
    ];

    return columns;
}