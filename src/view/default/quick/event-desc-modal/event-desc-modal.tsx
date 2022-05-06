import dayjs from 'dayjs';
import QRCode from 'qrcode';
import React, { FC, useEffect, useState } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { EventDescBox } from './styled/style';
import { EventDescModalProp } from './prop';
import { QuickEvent } from '@/schema/quick-event';
import Empty from 'antd/lib/empty';
import { getDb } from '@/utils/db';
import { TableName } from '@/schema/table-name';

/**
 * 点验案件详情框
 */
const EventDescModal: FC<EventDescModalProp> = ({
    visible,
    id,
    ip,
    cancelHandle
}) => {

    const [data, setData] = useState<QuickEvent | null>(null);

    useEffect(() => {
        if (visible) {
            (async () => {
                try {
                    const target = document.getElementById('qrcode');
                    await QRCode.toCanvas(target, `http://${ip}:9900/check`, {
                        width: 240,
                        margin: 2,
                        color: {
                            light: '#141414',
                            dark: '#ffffffd9'
                        }
                    });
                } catch (error) {
                    console.log(error);
                    message.warn('创建二维码失败');
                }
            })();
        }
    }, [visible]);

    useEffect(() => {
        const db = getDb<QuickEvent>(TableName.QuickEvent);
        if (visible) {
            (async () => {
                try {
                    const next = await db.findOne({ _id: id });
                    setData(next);
                } catch (error) {
                    console.warn(error);
                    setData(null);
                }
            })();
        }
    }, [id, visible]);

    /**
     * 渲染案件
     */
    const renderEvent = (data: QuickEvent | null) => {
        if (data === null) {
            return <Empty description="暂无数据" />
        }
        return <ul>
            <li>
                <label>案件名称</label>
                <span>{data.eventName.split('_')[0]}</span>
            </li>
            <li>
                <label>存储路径</label>
                <span>{data.eventPath}</span>
            </li>
            <li>
                <label>违规时段</label>
                <span>{data.ruleFrom} ~ {data.ruleTo}</span>
            </li>
            <li>
                <label>案件名称</label>
                <span>{dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            </li>
        </ul>;
    }

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="EDM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={false}
        width={850}
        title="点验案件详情"
    >
        <EventDescBox>
            <div className="qr">
                <div className="ibox">
                    <div className="caption">请打开浏览器扫码下载APK</div>
                </div>
                <div className="content">
                    <canvas width="240" height="240" id="qrcode" />
                </div>

            </div>
            <div className="desc">
                <div className="ibox">
                    <div className="caption">
                        案件
                    </div>
                    <div className="content">
                        {renderEvent(data)}
                    </div>
                </div>
            </div>
        </EventDescBox>
    </Modal>
};

export default EventDescModal;