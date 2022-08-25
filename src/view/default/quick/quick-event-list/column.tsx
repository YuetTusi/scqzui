import React, { MouseEvent } from "react";
import { Dispatch } from "dva";
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined'
import { ColumnsType } from "antd/lib/table";
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
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
        }, {
            dataIndex: '_id',
            key: 'more',
            align: 'center',
            width: 10,
            render: () => <MoreOutlined style={{ cursor: 'not-allowed' }} />
            // render: (id: string, { eventPath, eventName }: QuickEvent) => <Popover
            //     zIndex={9}
            //     trigger="click"
            //     content={
            //         <Button
            //             onClick={(event: MouseEvent<HTMLButtonElement>) => {
            //                 event.stopPropagation();
            //                 Modal.confirm({
            //                     title: '批量生成报告',
            //                     content: '所需时间较长，确定批量生成报告吗？',
            //                     okText: '是',
            //                     cancelText: '否',
            //                     centered: true,
            //                     async onOk() {
            //                         const db = getDb<QuickRecord>(TableName.QuickRecord);
            //                         const exePath = join(cwd, '../tools/CreateReport');
            //                         const nextId = helper.newId();
            //                         try {
            //                             const events = await db.find({ caseId: id });
            //                             if (events.length === 0) {
            //                                 message.destroy();
            //                                 message.info(`无${devText ?? '设备'}数据`);
            //                             } else {
            //                                 dispatch({
            //                                     type: 'alartMessage/addAlertMessage',
            //                                     payload: {
            //                                         id: nextId,
            //                                         msg: `正在批量生成「${`${eventName.split('_')[0]}`}」报告`
            //                                     }
            //                                 });
            //                                 dispatch({
            //                                     type: 'operateDoing/setCreatingDeviceId',
            //                                     payload: events.map(item => item._id)
            //                                 });
            //                                 const proc = execFile(
            //                                     join(exePath, 'create_report.exe'),
            //                                     [join(eventPath, eventName), events.map(item => item.phonePath).join('|')]
            //                                 );
            //                                 proc.once('error', () => {
            //                                     message.destroy();
            //                                     notification.error({
            //                                         type: 'error',
            //                                         message: '报告生成失败',
            //                                         description: '批量生成报告失败',
            //                                         duration: 0
            //                                     });
            //                                     dispatch({
            //                                         type: 'alartMessage/removeAlertMessage',
            //                                         payload: nextId
            //                                     });
            //                                     dispatch({
            //                                         type: 'operateDoing/clearCreatingDeviceId'
            //                                     });
            //                                 });
            //                                 proc.once('exit', () => {
            //                                     message.destroy();
            //                                     notification.success({
            //                                         type: 'success',
            //                                         message: '报告批量生成成功',
            //                                         description: `「${`${eventName.split('_')[0]}`}」报告生成成功`,
            //                                         duration: 0
            //                                     });
            //                                     dispatch({
            //                                         type: 'alartMessage/removeAlertMessage',
            //                                         payload: nextId
            //                                     });
            //                                     dispatch({
            //                                         type: 'operateDoing/clearCreatingDeviceId'
            //                                     });
            //                                     ipcRenderer.send('show-progress', false);
            //                                 });
            //                             }
            //                         } catch (error) {
            //                             log.error(`批量生成报告失败 @view/default/quick/quick-event-list/column.tsx: ${error.message}`);
            //                         }
            //                     }
            //                 });
            //             }}
            //             type="primary"
            //             size="small">生成报告</Button>
            //     }>
            //     <MoreOutlined style={{ color: '#0fb9b1', fontWeight: 'bold' }} />
            // </Popover>
        }
    ];
}

export { getColumns };