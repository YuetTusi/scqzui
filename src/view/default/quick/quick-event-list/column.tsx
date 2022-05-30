import React, { MouseEvent } from "react";
import { Dispatch } from "dva";
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined'
import { ColumnsType } from "antd/lib/table";
import Modal from 'antd/lib/modal';
import { helper } from "@/utils/helper";
import { QuickEvent } from "@/schema/quick-event";
import { NowrapText } from './styled/style';

const { caseText, fetchText } = helper.readConf()!;

const getColumns = (dispatch: Dispatch, ...handles: any[]): ColumnsType<QuickEvent> => {

    const [detailHandle] = handles;

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
                        detailHandle(record);
                    }}
                    className="primary-color"
                    title={`扫码${fetchText ?? '点验'}`} />
            }
        },
        {
            title: `${caseText ?? '案件'}名称`,
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
                return <a onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.stopPropagation();
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
                    e.stopPropagation();
                    const [name] = eventName.split('_');
                    Modal.confirm({
                        onOk() {
                            dispatch({ type: 'quickEventList/del', payload: value });
                        },
                        title: `删除${caseText ?? '案件'}`,
                        content: `确认删除「${name}」？`,
                        okText: '是',
                        cancelText: '否',
                        centered: true
                    });
                }}>删除</a>
            }
        }
    ];
}

export { getColumns };