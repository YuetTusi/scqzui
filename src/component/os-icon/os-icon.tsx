import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import React, { FC } from 'react';
import { DeviceSystem } from '@/schema/device-system';
import harmonyOsSvg from './styled/font/harmonyos.svg';
import { OsIconProp } from './prop';
import { AndroidIconBox, AppleIconBox } from './styled/box';

/**
 * 系统图标
 */
const OsIcon: FC<OsIconProp> = ({ system }) => {

    switch (system) {
        case DeviceSystem.Android:
            return <AndroidIconBox>
                <AndroidFilled title="安卓设备" />
            </AndroidIconBox>;
        case DeviceSystem.IOS:
            return <AppleIconBox>
                <AppleFilled title="苹果设备" />
            </AppleIconBox>;
        case DeviceSystem.HarmonyOS:
            return <img
                style={{
                    position: 'relative',
                    top: '-2px'
                }}
                src={harmonyOsSvg}
                width={15}
                height={15}
                title="鸿蒙设备" />;
        default:
            return <AndroidFilled />;
    }
};

export { OsIcon };