import React, { FC, useEffect, useState, useRef } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import dayjs from 'dayjs';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { useSubscribe } from '@/hook';
import FetchRecord, { ProgressType } from '@/schema/fetch-record';
import { FetchRecordBox } from './styled/style';
import { LiveModalProp } from './prop';

/**
 * 采集记录框（此框用于采集时实显示进度消息）
 */
const LiveModal: FC<LiveModalProp> = ({ title, device, visible, cancelHandle }) => {
    const [data, setData] = useState<FetchRecord[]>([]);
    const scrollBox = useRef<HTMLDivElement>(null);

    /**
     * 接收主进程传来的采集进度数据
     */
    const receiveFetchProgress = (event: IpcRendererEvent, arg: FetchRecord[]) => {
        setData(arg);
        if (scrollBox.current) {
            const h = scrollBox.current.scrollHeight;
            scrollBox.current.scrollTo(0, h);
        }
    };

    useSubscribe('receive-fetch-progress', receiveFetchProgress);

    useEffect(() => {
        if (visible) {
            ipcRenderer.send('get-fetch-progress', device?.usb);
        } else {
            setData([]);
        }
    }, [visible]);

    /**
     * 渲染时间
     * @param time 时间对象
     */
    const renderTime = (time: Date) => {
        if (helper.isNullOrUndefined(time)) {
            return '- - -';
        } else {
            return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        }
    };

    /**
     * 渲染记录数据
     */
    const renderData = () => {

        if (data.length === 0) {
            return (
                <div className="middle">
                    <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            );
        } else {
            return (
                <ul>
                    {data.map((item, i) => {
                        switch (item.type) {
                            case ProgressType.Normal:
                                return (
                                    <li key={`L_${i}`}>
                                        <label>【{renderTime(item.time)}】</label>
                                        <span style={{ color: '#fff' }}>{item.info}</span>
                                    </li>
                                );
                            case ProgressType.Warning:
                                return (
                                    <li key={`L_${i}`}>
                                        <label>【{renderTime(item.time)}】</label>
                                        <span style={{ color: '#dc143c', fontWeight: 'bold' }}>{item.info}</span>
                                    </li>
                                );
                            case ProgressType.Message:
                                return (
                                    <li key={`L_${i}`}>
                                        <label>【{renderTime(item.time)}】</label>
                                        <span style={{ color: '#f9ca24' }}>{item.info}</span>
                                    </li>
                                );
                            default:
                                return (
                                    <li key={`L_${i}`}>
                                        <label>【{renderTime(item.time)}】</label>
                                        <span style={{ color: '#fff' }}>{item.info}</span>
                                    </li>
                                );
                        }
                    })}
                </ul>
            );
        }
    };

    return (
        <Modal
            visible={visible}
            footer={[
                <Button type="default" onClick={cancelHandle} key="REC_B0">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>
            ]}
            onCancel={cancelHandle}
            title={title}
            width={800}
            centered={true}
            maskClosable={false}
            className="zero-padding-body">
            <FetchRecordBox>
                <div className="list-block" ref={scrollBox}>
                    {renderData()}
                </div>
            </FetchRecordBox>

        </Modal>
    );
};

LiveModal.defaultProps = {
    visible: false,
    title: '采集记录',
    cancelHandle: () => { }
};

export { LiveModal };
