import kebabCase from 'lodash/kebabCase';
import React, { FC } from 'react';
import { useSelector } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import Empty from 'antd/lib/empty';
import Badge from 'antd/lib/badge';
import DeviceSystem from '@/schema/device-system';
import { FetchState } from '@/schema/device-state';
import { StateTree } from '@/type/model';
import { DeviceStoreState } from '@/model/default/device';
import { FetchButton } from './fetch-button';
import { MobileInfo } from './mobile-info';
import { DeivceBox, Nothing } from './styled/device-box';
import { DeviceFrameProp } from './prop';

const { Ribbon } = Badge;

/**
 * 依据采集状态返回样式类名
 * @param fetchState 采集状态
 */
const getClassNameByFetchState = (fetchState?: FetchState) =>
    kebabCase(fetchState);

/**
 * 手机图标
 */
const MobileIco: FC<{ deviceSystem?: DeviceSystem }> = ({ deviceSystem }) => {
    switch (deviceSystem) {
        case DeviceSystem.Android:
            return <FontAwesomeIcon icon={faAndroid} />;
        case DeviceSystem.IOS:
            return <FontAwesomeIcon icon={faApple} />;
        default:
            return <FontAwesomeIcon icon={faQuestionCircle} />;
    }
};

/**
 * 设备框列表
 */
const DeviceFrame: FC<DeviceFrameProp> = ({
    onHelpHandle,
    onNormalHandle
}) => {

    const { deviceList } = useSelector<StateTree, DeviceStoreState>(state => state.device);

    if (deviceList.every(item => item === undefined)) {
        return <Nothing>
            <Empty
                description={<span className="nothing-desc">未检测到设备，请插入USB</span>}
                image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Nothing>
    } else {

        const list = deviceList.map(item => {
            return <Ribbon text={`终端#${item.usb ?? ''}`} key={`USB_${item.usb}`}>
                <DeivceBox className={getClassNameByFetchState(item.fetchState)}>
                    <div className="ico">
                        <MobileIco deviceSystem={item.system} />
                    </div>
                    <div className="fns">
                        <MobileInfo device={item} />
                        <div className="buttons">
                            <FetchButton
                                device={item}
                                onHelpHandle={onHelpHandle}
                                onNormalHandle={onNormalHandle}
                                onStopHandle={(data) => console.log(data)}
                                onServerCloudHandle={(data) => console.log(data)} />
                        </div>
                    </div>
                </DeivceBox>
            </Ribbon>
        });
        return <>{list}</>
    }
}

export { DeviceFrame };