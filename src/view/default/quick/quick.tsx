import debounce from 'lodash/debounce';
import React, { FC, MouseEvent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'dva';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { QuickEvent } from '@/schema/quick-event';
import { CheckingPanel, QuickBox, TableBox } from './styled/style';
import EventList from './quick-event-list';
import EditQuickEventModal from './edit-quick-event-modal';
import EventDescModal from './event-desc-modal';
import CheckingList from './checking-list';
import RecordList from './record-list';

const { fetchText, caseText, devText } = helper.readConf()!;

/**
 * 快速点验
 */
const Quick: FC<{}> = () => {

    const dispatch = useDispatch();
    const ipWhiteList = useRef<string[]>(helper.QUICK_QR_IP);//IP白名单
    const portOccupy = useRef<boolean>(false); //端口占用
    const [detailId, setDetailId] = useState<string>('');
    const [ip, setIp] = useState<string>('127.0.0.1');
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
     * 详情handle
     */
    const detailHandle = debounce(({ _id }: QuickEvent) => {

        const allowIp = ipWhiteList.current.reduce<string[]>((acc, current) => {
            if (helper.hasIP(current)) {
                acc.push(current);
            }
            return acc;
        }, []);
        if (portOccupy.current) {
            Modal.warn({
                title: '端口占用',
                content: `点验端口已被其他服务占用，请检查`,
                okText: '确定',
                centered: true
            });
        } else if (allowIp.length === 0) {
            Modal.warn({
                title: '生成二维码失败',
                content: '未检测到采集WiFi或路由器，请确认WiFi正常或连接采集盒子',
                okText: '确定',
                centered: true
            });
        } else {
            setIp(allowIp[0]);
            setDetailId(_id!);
            setEventDescVisible(true);
        }
    }, 500, { leading: true, trailing: false });

    /**
     * 添加Click
     */
    const onAddClick = (event: MouseEvent) => {
        event.preventDefault();
        dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
    };

    return <SubLayout title={`快速${fetchText ?? '点验'}`}>
        <QuickBox>
            <div className="search-bar">
                <Button onClick={onAddClick} type="primary">
                    <PlusCircleOutlined />
                    <span>添加{fetchText ?? '点验'}</span>
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
                        {`${fetchText ?? '点验'}${caseText ?? '案件'}`}
                    </div>
                    <div>
                        <EventList
                            detailHandle={detailHandle} />
                    </div>
                </div>
                <div className="dev-list">
                    <div className="title-bar">
                        {devText ?? '设备'}
                    </div>
                    <div>
                        <RecordList />
                    </div>
                </div>
            </TableBox>
        </QuickBox>
        <EditQuickEventModal />
        <EventDescModal
            cancelHandle={() => {
                setEventDescVisible(false)
            }}
            visible={eventDescVisible}
            id={detailId}
            ip={ip}
        />
    </SubLayout>;
}

export default Quick;