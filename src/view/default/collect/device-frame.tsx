import kebabCase from 'lodash/kebabCase';
import React, { FC } from 'react';
import { useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Badge from 'antd/lib/badge';
import { TipType } from '@/schema/tip-type';
import { FetchState } from '@/schema/device-state';
import { DeviceType } from '@/schema/device-type';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { DeviceStoreState } from '@/model/default/device';
import { FetchButton } from './fetch-button';
import { MobileInfo } from './mobile-info';
import { MobileIco } from './mobile-ico';
import { DeivceBox, Nothing } from './styled/device-box';
import { DeviceFrameProp } from './prop';


const { Ribbon } = Badge;

/**
 * 依据采集状态返回样式类名
 * @param fetchState 采集状态
 */
const getClassNameByState = (device: DeviceType) => {

    let name = kebabCase(device?.fetchState ?? FetchState.Waiting);

    switch (device?.tipType) {
        case TipType.Flash:
        case TipType.CloudCode:
        case TipType.UMagicCode:
        case TipType.ApplePassword:
            name += ' flash';
            break;
    }
    return name;
}

/**
 * 消息链接文本
 */
const getTipTxt = (device: DeviceType) => {
    if (helper.isNullOrUndefined(device)) {
        return '';
    }
    const { usb, tipType } = device;
    let txt: string = '';
    switch (tipType) {
        case TipType.Flash:
            txt = '操作确认';
            break;
        case TipType.Normal:
            txt = '操作提示';
            break;
        case TipType.ApplePassword:
            txt = '密码确认';
            break;
        case TipType.CloudCode:
            txt = '云取进度';
            break;
        case TipType.UMagicCode:
            txt = '连接码';
            break;
        case TipType.Nothing:
            txt = `终端${usb ?? ''}`;
            break;
        default:
            txt = `终端${usb ?? ''}`;
            break;
    }
    return txt;
};

/**
 * 设备框列表
 */
const DeviceFrame: FC<DeviceFrameProp> = ({
    onHelpHandle,
    onNormalHandle,
    onServerCloudHandle,
    onRecordHandle,
    onStopHandle,
    onTipHandle
}) => {

    const { deviceList } = useSelector<StateTree, DeviceStoreState>(state => state.device);

    if (deviceList.every(item => item === undefined)) {
        return <Nothing>
            <Empty
                description={<span className="nothing-desc">未检测到设备，请插入USB</span>}
                image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Nothing>
    } else {

        const list = deviceList.map((item, index) => {
            if (item === undefined) {
                return null;
            } else {
                return <Ribbon text={getTipTxt(item)} key={`USB_${item?.usb ?? index}`}>
                    <DeivceBox
                        onClick={() => onTipHandle(item)}
                        className={getClassNameByState(item)}>
                        <div className="ico">
                            <MobileIco device={item} />
                        </div>
                        <div className="fns">
                            <MobileInfo
                                device={item}
                                recordHandle={() => onRecordHandle(item)}
                            />
                            <div className="buttons">
                                <FetchButton
                                    device={item}
                                    onHelpHandle={onHelpHandle}
                                    onNormalHandle={onNormalHandle}
                                    onStopHandle={onStopHandle}
                                    onServerCloudHandle={onServerCloudHandle} />
                            </div>
                        </div>
                    </DeivceBox>
                </Ribbon>
            }
        });
        return <>{list}</>
    }
}

export { DeviceFrame };