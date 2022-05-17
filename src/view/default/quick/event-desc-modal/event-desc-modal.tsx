import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';
import Empty from 'antd/lib/empty';
import message from 'antd/lib/message';
import { useSubscribe } from '@/hook';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { EventDescBox } from './styled/style';
import { EventDescModalProp } from './prop';

const { caseText } = helper.readConf()!;
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
    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            (async () => {
                try {
                    const target = document.getElementById('qrcode');
                    await QRCode.toCanvas(target, `http://${ip}:9900/check/${id}`, {
                        width: 240,
                        margin: 2,
                        color: {
                            light: '#181d30',
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
     * 扫描二维码完成响应
     * @param finish 扫码完成
     */
    const quickScannedHandle = (event: IpcRendererEvent, finish: boolean) => {
        setScanned(finish);
        setTimeout(() => {
            setScanned(false);
        }, 3000);
    };

    useSubscribe('quick-scanned', quickScannedHandle);

    /**
     * 渲染案件
     */
    const renderEvent = (data: QuickEvent | null) => {
        if (data === null) {
            return <Empty description="暂无数据" />
        }
        return <ul>
            <li>
                <label>{`${caseText ?? '案件'}名称`}</label>
                <span>{data.eventName.split('_')[0]}</span>
            </li>
            <li>
                <label>存储位置</label>
                <span>{data.eventPath}</span>
            </li>
            <li>
                <label>违规时段</label>
                <span>{data.ruleFrom} 时 ~ {data.ruleTo} 时</span>
            </li>
            <li>
                <label>创建时间</label>
                <span>{dayjs(data.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}</span>
            </li>
            <li>
                <label>IP地址</label>
                <span>{ip ?? ''}</span>
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
        title="快速点验"
    >
        <EventDescBox>
            <div className="qr">
                <div className="ibox">
                    <div className="caption">请用手机浏览器扫码点验</div>
                </div>
                <div className="content">
                    <Spin
                        spinning={scanned}
                        indicator={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                        tip={<span style={{ color: '#52c41a' }}>扫码成功</span>}
                    >
                        <canvas width="320" height="320" id="qrcode" />
                    </Spin>
                </div>

            </div>
            <div className="desc">
                <div className="ibox">
                    <div className="caption">
                        {`${caseText ?? '案件'}信息`}
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