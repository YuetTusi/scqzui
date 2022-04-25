import { join } from 'path';
import { shell } from 'electron';
import React, { MouseEvent } from "react";
import { Dispatch } from "dva";
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined'
import { ColumnsType } from "antd/lib/table";
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { QuickEvent } from "@/schema/quick-event";
import { NowrapText } from './styled/style';

const getColumns = (dispatch: Dispatch, ...handles: any[]): ColumnsType<QuickEvent> => {

    const [qrcodeHandle, detailHandle] = handles;

    return [
        {
            title: '',
            dataIndex: '_id',
            key: 'qr',
            width: 20,
            align: 'center',
            render(value: string, record) {
                return <QrcodeOutlined
                    onClick={(e: MouseEvent<HTMLSpanElement>) => {
                        e.stopPropagation();
                        qrcodeHandle(record);
                    }}
                    className="primary-color"
                    title="扫码点验" />
            }
        },
        {
            title: '案件名称',
            dataIndex: 'eventName',
            key: 'eventName',
            render(value: string, record) {
                const [name] = value.split('_');
                return <NowrapText onClick={async (e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
                    detailHandle(record);
                }}>
                    {name}
                </NowrapText>
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
            dataIndex: '_id',
            key: 'del',
            width: 50,
            align: 'center',
            render(value: string, { eventName }) {
                return <a onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    const [name] = eventName.split('_');
                    e.preventDefault();
                    Modal.confirm({
                        onOk() {
                            dispatch({ type: 'quickEventList/del', payload: value });
                        },
                        title: '删除点验案件',
                        content: `确认删除「${name}」？`,
                        okText: '是',
                        cancelText: '否'
                    });
                }}>删除</a>
            }
        }
    ];
}

export { getColumns };