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
import { EventDescBox, HelpBox } from './styled/style';
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
                        width: 200,
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
        width={740}
        title="快速点验"
    >
        <EventDescBox>
            <div className="ibox">
                <div className="content">
                    <HelpBox>
                        <label className="step-label">步骤1</label>
                        <p>使用手机连接热点或采集盒子WiFi</p>
                        <label className="step-label">步骤2</label>
                        <p>打开浏览器扫描下方二维码，下载APP并安装</p>
                        <div>
                            <Spin
                                spinning={scanned}
                                indicator={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                                tip={<span style={{ color: '#52c41a' }}>扫码成功</span>}
                            >
                                <canvas width="200" height="200" id="qrcode" />
                            </Spin>
                        </div>
                        <label className="step-label">步骤3</label>
                        <p>选择案件，开始点验</p>
                        <label className="step-label">步骤4</label>
                        <p>等待手机点验完成后，可卸载APP</p>
                    </HelpBox>
                    <div className="event-info">
                        <div className="caption">
                            案件信息
                        </div>
                        <div className="cinfo">
                            {renderEvent(data)}
                        </div>
                    </div>
                </div>
            </div>
        </EventDescBox>
    </Modal>
};

export default EventDescModal;