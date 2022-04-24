import React from "react";
import { Dispatch } from "dva";
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined'
import { ColumnsType } from "antd/lib/table";
import { QuickEvent } from "@/schema/quick-event";

const getColumns = (dispatch: Dispatch): ColumnsType<QuickEvent> => {

    return [
        {
            title: '',
            dataIndex: '_id',
            key: 'qr',
            width: 20,
            align: 'center',
            render(value: string) {
                return <QrcodeOutlined className="primary-color" title="扫码点验" />
            }
        },
        {
            title: '案件名称',
            dataIndex: 'eventName',
            key: 'eventName',
            render(value: string) {
                const [name] = value.split('_');
                return <span>{name}</span>
            }
        },
        {
            title: '编辑',
            dataIndex: 'edit',
            key: 'edit',
            width: 50,
            align: 'center',
            render(value: string, record) {
                return <a onClick={() => {
                    dispatch({ type: 'editQuickEventModal/setData', payload: record });
                    dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
                }}>编辑</a>
            }
        },
        {
            title: '删除',
            dataIndex: 'del',
            key: 'del',
            width: 50,
            align: 'center',
            render(value: string) {
                return <a>删除</a>
            }
        }
    ];
}

export { getColumns };