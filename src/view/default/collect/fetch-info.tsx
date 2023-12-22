import { IpcRendererEvent, ipcRenderer } from 'electron';
import React, { FC, memo, MouseEvent, useEffect, useState } from 'react';
import { useSubscribe } from '@/hook';
import DeviceType from '@/schema/device-type';
import { FetchRecord, ProgressType } from '@/schema/fetch-record';
import { FetchInfoBox } from './styled/fetch-info-box';

const prev = new Map<number, FetchRecord>();

interface FetchInfoProp {
    /**
     * 设备
     */
    device: DeviceType | null,
    /**
     * 采集记录handle
     */
    recordHandle: (arg0: DeviceType) => void,
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
 */
const FetchInfo: FC<FetchInfoProp> = memo(({ device, recordHandle }) => {
    const [data, setData] = useState<FetchRecord>();

    useEffect(() => {
        ipcRenderer.send('get-last-progress', device?.usb);
    }, []);

    /**
     * 接收进度消息
     * @param event
     * @param arg
     */
    const progressHandle = (_: IpcRendererEvent, arg: EventMessage) => {
        if (arg.usb === device?.usb) {
            prev.set(arg.usb, arg.fetchRecord);
            setData(arg.fetchRecord);
        }
    };

    /**
     * 采集结束后监听消息，清除USB序号对应的缓存
     * @param usb 序号
     */
    const fetchOverHandle = (_: IpcRendererEvent, usb: number) => prev.delete(usb);

    /**
     * 接收当前USB序号的最新一条进度消息
     * # 当用户切回采集页面时，组件要立即加载上（最近）一条进度
     */
    const receiveFetchLastProgressHandle = (_: IpcRendererEvent, arg: EventMessage) => {
        if (arg.usb === device?.usb) {
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
            temp = prev.get(device?.usb!);
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

    /**
     * 采集记录Click
     * @param event 事件对象
     */
    const onRecordClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        recordHandle(device!);
    }

    return <FetchInfoBox onClick={onRecordClick}>
        {setColor()}
    </FetchInfoBox>;
});

FetchInfo.defaultProps = {
    device: null,
    recordHandle: () => { }
};

export { FetchInfo };