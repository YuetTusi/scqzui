import React, { FC } from 'react';
import { helper } from '@/utils/helper';
import { FetchState } from '@/schema/device-state';
import { MobileInfoProp } from './prop';

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
const MobileInfo: FC<MobileInfoProp> = ({ device }) => {

    switch (device.fetchState) {
        case FetchState.NotConnected:
            return <div className="help">
                <p>暂未连接到设备</p>
                <div>安卓设备请打开<strong>USB调试</strong>且是<strong>文件传输模式</strong></div>
                <div>苹果设备请点击<strong>信任</strong>此电脑</div>
            </div>;
        case FetchState.Connected:
        case FetchState.Finished:
            return <div className="help">
                {device.extra === undefined ? null : <p>{device.extra}</p>}
                <ModelList phoneInfo={device.phoneInfo!} />
            </div>;
        case FetchState.Fetching:
            return null;
        default:
            return null;
    }

    return <div></div>;
}

export { MobileInfo };