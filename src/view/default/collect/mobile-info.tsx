import React, { FC, MouseEvent } from 'react';
import Clock from '@/component/clock';
import { helper } from '@/utils/helper';
import { FetchState } from '@/schema/device-state';
import { FetchInfo } from './fetch-info';
import { CaseInfo } from './case-info';
import { MobileInfoProp } from './prop';

const { fetchText, devText } = helper.readConf()!;

const ModelList: FC<{ phoneInfo: { name: string, value: string }[] }> = ({ phoneInfo }) => {

    if (helper.isNullOrUndefined(phoneInfo)) {
        return <ul></ul>;
    } else {
        return <ul>{
            phoneInfo.map(({ name, value }, index) => <li key={`MANU_${index}`}>
                <label>{name}</label>
                <span>{value}</span>
            </li>)
        }</ul>
    }
}

/**
 * 信息块内容
 */
const MobileInfo: FC<MobileInfoProp> = ({ device, recordHandle }) => {

    if (helper.isNullOrUndefined(device)) {
        return <>
            <div className="help">
                <p>{`暂未连接到${devText ?? '设备'}`}</p>
                <div>{`安卓${devText ?? '设备'}请打开`}<strong>USB调试</strong>且是<strong>文件传输模式</strong></div>
                <div>{`苹果${devText ?? '设备'}请点击`}<strong>信任</strong>此电脑</div>
            </div>
        </>;
    }

    const { fetchState, extra, phoneInfo, usb } = device;

    /**
     * 采集记录Click
     * @param event 事件对象
     */
    const onRecordClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        recordHandle(device);
    }

    switch (fetchState) {
        case FetchState.NotConnected:
            return <>
                <div className="help">
                    <p>{`暂未连接到${devText ?? '设备'}`}</p>
                    <div>{`安卓${devText ?? '设备'}请打开`}<strong>USB调试</strong>且是<strong>文件传输模式</strong></div>
                    <div>{`苹果${devText ?? '设备'}请点击`}<strong>信任</strong>此电脑</div>
                </div>
            </>;
        case FetchState.Connected:
            return <>
                <div className="help">
                    {extra === undefined ? null : <p>{extra}</p>}
                    <ModelList phoneInfo={phoneInfo!} />
                </div>
                <div className="rec-link"></div>
            </>;
        case FetchState.Finished:
            return <>
                <div className="help">
                    {extra === undefined ? null : <p>{extra}</p>}
                </div>
                <CaseInfo usb={usb!} />
                <div className="rec-link">
                    <a onClick={onRecordClick}>{`${fetchText ?? '取证'}记录`}</a>
                </div>
            </>;
        case FetchState.Fetching:
            return <>
                <div className="help">
                    <div className="clock">
                        <Clock usb={Number(usb!) - 1} />
                    </div>
                    <FetchInfo device={device} recordHandle={recordHandle} />
                </div>
                <CaseInfo usb={usb!} />
            </>;
        default:
            return null;
    }
}

export { MobileInfo };