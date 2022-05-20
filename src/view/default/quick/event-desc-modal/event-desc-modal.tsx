import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Descriptions from 'antd/lib/descriptions';
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';
import Empty from 'antd/lib/empty';
import message from 'antd/lib/message';
import { useSubscribe } from '@/hook';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { EventDescBox, HelpBox, HorBox } from './styled/style';
import { EventDescModalProp } from './prop';

const { caseText } = helper.readConf()!;
const { Item } = Descriptions;
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
                        width: 160,
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
        return <Descriptions bordered={true} size="small">
            <Item label={`${caseText ?? '案件'}名称`} span={3}>{data.eventName.split('_')[0]}</Item>
            <Item label="存储位置" span={3}>{data.eventPath}</Item>
            <Item label="违规时段">{data.ruleFrom} 时 ~ {data.ruleTo} 时</Item>
            <Item label="创建时间">{dayjs(data.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}</Item>
            <Item label="IP地址">{ip ?? ''}</Item>
        </Descriptions>
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
        width={1000}
        title="快速点验"
    >
        <EventDescBox>
            <HelpBox>
                <div className="step">
                    <label className="step-label">步骤1</label>
                    <div className="desc">
                        使用手机连接到
                        <div><strong>{ip === '192.168.191.1' ? 'WiFi：快速点验密码8个1  密码：11111111' : 'WiFi：abco_apbc5G  密码：11111111'}</strong></div>
                    </div>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤2</label>
                    <HorBox>
                        <div className="desc">
                            <div>使用手机浏览器扫描右侧二维码，下载APP安装后打开「采集助手」</div>
                        </div>
                        <Spin
                            spinning={scanned}
                            indicator={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                            tip={<span style={{ color: '#52c41a' }}>扫码成功</span>}
                        >
                            <canvas width="160" height="160" id="qrcode" />
                        </Spin>
                    </HorBox>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤3</label>
                    <div className="desc">{`选择${caseText ?? '案件'}，输入编号及名称后确认`}</div>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤4</label>
                    <div className="desc">等待手机点验完成后，可卸载「采集助手」</div>
                </div>
            </HelpBox>
            <div className="ibox">
                <div className="content">
                    <div className="event-info">
                        <div className="caption">
                            {`${caseText ?? '案件'}信息`}
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