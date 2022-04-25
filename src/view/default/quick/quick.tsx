import debounce from 'lodash/debounce';
import React, { FC, MouseEvent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'dva';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { CheckingPanel, QuickBox, TableBox } from './styled/style';
import EventList from './quick-event-list';
import EditQuickEventModal from './edit-quick-event-modal';
import QuickQRCodeModal from './quick-qrcode-modal';
import EventDescModal from './event-desc-modal';
import CheckingList from './checking-list';
import { QuickEvent } from '@/schema/quick-event';

/**
 * 快速点验
 */
const Quick: FC<{}> = () => {

    const dispatch = useDispatch();
    const portOccupy = useRef<boolean>(false); //端口占用
    const [detailId, setDetailId] = useState<string>('');
    const [ip, setIp] = useState<string>('127.0.0.1');
    const [quickQRCodeModalVisible, setQuickQRCodeModalVisble] = useState<boolean>(false);
    const [eventDescVisible, setEventDescVisible] = useState<boolean>(false);

    useEffect(() => {
        let nextHttp = 9900;
        let nextService = 57999;
        (async () => {
            try {
                [nextHttp, nextService] = await Promise.all([
                    helper.portStat(9900),
                    helper.portStat(57999)
                ]);
                if (nextHttp !== 9900 || nextService !== 57999) {
                    portOccupy.current = true;
                } else {
                    portOccupy.current = false;
                }
            } catch (err) {
                console.warn(err);
                portOccupy.current = true;
            }
        })();
    }, []);

    /**
     * 二维码handle
     */
    const qrcodeHandle = debounce((data: QuickEvent) => {
        let hasHotSpot = helper.hasIP('192.168.137.1');
        let hasRouter = helper.hasIP('192.168.50.99');
        if (portOccupy.current) {
            Modal.warn({
                title: '端口占用',
                content: `点验端口已被其他服务占用，请检查`,
                okText: '确定',
                centered: true
            });
        } else if (!hasHotSpot && !hasRouter) {
            Modal.warn({
                title: '生成二维码失败',
                content: '未检测到热点或路由器，请连接采集盒子或者打开电脑上的移动热点',
                okText: '确定',
                centered: true
            });
        } else {
            setQuickQRCodeModalVisble(true);
        }
    }, 500, { leading: true, trailing: false });

    /**
     * 详情handle
     */
    const detailHandle = debounce(({ _id }: QuickEvent) => {
        setDetailId(_id!);
        setEventDescVisible(true);
    }, 500, { leading: true, trailing: false });

    /**
     * 添加Click
     */
    const onAddClick = (event: MouseEvent) => {
        event.preventDefault();
        dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
    };

    return <SubLayout title="快速点验">
        <QuickBox>
            <div className="search-bar">
                <Button onClick={onAddClick} type="primary">
                    <PlusCircleOutlined />
                    <span>添加点验</span>
                </Button>
            </div>
            <Split />
            <CheckingPanel>
                <CheckingList />
            </CheckingPanel>
            <Split />
            <TableBox>
                <div className="case-list">
                    <div className="title-bar">
                        点验案件
                    </div>
                    <div>
                        <EventList
                            detailHandle={detailHandle}
                            qrcodeHandle={qrcodeHandle} />
                    </div>
                </div>
                <div className="dev-list">
                    <div className="title-bar">
                        设备
                    </div>
                    <div>
                        Device
                    </div>
                </div>
            </TableBox>
        </QuickBox>
        <EditQuickEventModal />
        <QuickQRCodeModal
            visible={quickQRCodeModalVisible}
            ip={ip}
            cancelHandle={() => setQuickQRCodeModalVisble(false)} />
        <EventDescModal
            cancelHandle={() => setEventDescVisible(false)}
            visible={eventDescVisible}
            id={detailId}
        />
    </SubLayout>;
}

export default Quick;