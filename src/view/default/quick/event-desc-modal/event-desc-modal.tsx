import dayjs from 'dayjs';
import QRCode from 'qrcode';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { shell, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
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
import { WiFiTips } from './wifi-tips';
import { EventDescBox, HelpBox, HorBox } from './styled/style';
import { EventDescModalProp } from './prop';

const { caseText, fetchText, parseText } = helper.readConf()!;
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
                        width: 300,
                        margin: 1,
                        color: {
                            light: '#ffffff',
                            dark: '#181d30'
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
    const quickScannedHandle = (_: IpcRendererEvent, finish: boolean) => {
        setScanned(finish);
        setTimeout(() => {
            setScanned(false);
        }, 3000);
    };

    useSubscribe('quick-scanned', quickScannedHandle);

    /**
     * 在系统中打开目录
     * @param event 
     */
    const openFolderClick = debounce(async (event: MouseEvent<HTMLAnchorElement>, data: QuickEvent) => {
        event.preventDefault();
        const { eventPath } = data;
        message.destroy();
        try {
            const exist = await helper.existFile(eventPath);
            if (exist) {
                shell.openPath(eventPath);
            } else {
                message.warn('案件目录不存在');
            }
        } catch (error) {
            console.warn(error.message);
        }
    }, 500, { leading: true, trailing: false });

    /**
     * 渲染案件
     */
    const renderEvent = (data: QuickEvent | null) => {
        if (data === null) {
            return <Empty description="暂无数据" />
        }
        return <Descriptions bordered={true} size="small">
            <Item label={`${caseText ?? '案件'}名称`} span={3}>{data.eventName.split('_')[0]}</Item>
            <Item label="存储位置" span={3}>
                <a
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => openFolderClick(event, data)}
                    type="link">
                    {data.eventPath}
                </a>
            </Item>
            <Item label="违规时段">{data.ruleFrom} 时 ~ {data.ruleTo} 时</Item>
            <Item label="创建时间">{dayjs(data.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}</Item>
            <Item label="IP地址">{ip ?? ''}</Item>
        </Descriptions>
    };



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
        width={1120}
        title={`快速${fetchText ?? '点验'}`}
    >
        <EventDescBox>
            <HelpBox>
                <div className="step">
                    <label className="step-label">步骤1</label>
                    <div className="desc">
                        请使用手机连接到
                        <div><WiFiTips ip={ip} /></div>
                    </div>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤2</label>
                    <HorBox>
                        <div className="desc">
                            <div>使用手机浏览器<strong>扫描右侧二维码</strong>，下载APP安装后打开「<strong>采集助手</strong>」</div>
                            <div style={{ marginTop: '20px' }}><strong>提示：如果无法完成扫码，请安装花瓣览器重新扫描</strong></div>
                        </div>
                        <Spin
                            spinning={scanned}
                            indicator={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                            tip={<span style={{ color: '#52c41a' }}>扫码成功</span>}
                        >
                            <canvas width="280" height="280" id="qrcode" />
                        </Spin>
                    </HorBox>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤3</label>
                    <div className="desc">
                        <div>
                            选择<strong>{caseText ?? '案件'}</strong>，输入<strong>编号</strong>及<strong>名称</strong>后确认，等待{fetchText ?? '取证'}完成
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <strong>提示：采集助手会提示开启相关权限，请一律允许</strong>
                        </div>
                    </div>
                </div>
                <FontAwesomeIcon icon={faArrowRight} style={{ margin: '5px' }} />
                <div className="step">
                    <label className="step-label">步骤4</label>
                    <div className="desc">完成后将自动{parseText ?? '解析'}数据，可以卸载「<strong>采集助手</strong>」</div>
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