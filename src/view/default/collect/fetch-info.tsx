import { IpcRendererEvent, ipcRenderer } from 'electron';
import React, { FC, memo, useEffect, useState } from 'react';
import { useSubscribe } from '@/hook';
import { FetchRecord, ProgressType } from '@/schema/fetch-record';
import { FetchInfoBox } from './styled/fetch-info-box';

const prev = new Map<number, FetchRecord>();

interface FetchInfoProp {
    /**
     * 设备序号
     */
    usb: number;
}

interface EventMessage {
    /**
     * 当前消息所属设备序号
     */
    usb: number;
    /**
     * 采集记录
     */
    fetchRecord: FetchRecord;
}

/**
 * 采集进度消息组件
 * @param props
 */
const FetchInfo: FC<FetchInfoProp> = memo(({ usb }) => {
    const [data, setData] = useState<FetchRecord>();

    useEffect(() => {
        ipcRenderer.send('get-last-progress', usb);
    }, []);

    /**
     * 接收进度消息
     * @param event
     * @param arg
     */
    const progressHandle = (event: IpcRendererEvent, arg: EventMessage) => {
        if (arg.usb === usb) {
            prev.set(arg.usb, arg.fetchRecord);
            setData(arg.fetchRecord);
        }
    };

    /**
     * 采集结束后监听消息，清除USB序号对应的缓存
     * @param usb 序号
     */
    const fetchOverHandle = (event: IpcRendererEvent, usb: number) => {
        prev.delete(usb);
    };

    /**
     * 接收当前USB序号的最新一条进度消息
     * # 当用户切回采集页面时，组件要立即加载上（最近）一条进度
     */
    const receiveFetchLastProgressHandle = (event: IpcRendererEvent, arg: EventMessage) => {
        if (arg.usb === usb) {
            prev.set(arg.usb, arg.fetchRecord);
            setData(arg.fetchRecord);
        }
    };

    /**
     * 进度着色
     */
    const setColor = () => {
        let temp: FetchRecord | undefined;
        if (data) {
            temp = data;
        } else {
            temp = prev.get(usb);
        }

        switch (temp?.type) {
            case ProgressType.Normal:
                return <span className="info-default">{temp?.info ?? ''}</span>;
            case ProgressType.Message:
                return <span className="info-primary">{temp?.info ?? ''}</span>;
            case ProgressType.Warning:
                return <span className="info-danger">{temp?.info ?? ''}</span>;
            default:
                return <span className="info-default">{temp?.info ?? ''}</span>;
        }
    };

    useSubscribe('receive-fetch-last-progress', receiveFetchLastProgressHandle);
    useSubscribe('fetch-progress', progressHandle);
    useSubscribe('fetch-over', fetchOverHandle);

    return (
        <FetchInfoBox>
            {setColor()}
        </FetchInfoBox>
    );
});

export { FetchInfo };
