import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import React, { FC } from 'react';
import { DeviceSystem } from '@/schema/device-system';
import harmonyOsSvg from './styled/font/harmonyos.svg';
import { OsIconProp } from './prop';

/**
 * 系统图标
 */
const OsIcon: FC<OsIconProp> = ({ system }) => {

    switch (system) {
        case DeviceSystem.Android:
            return <AndroidFilled style={{ color: '#76c058' }} title="安卓设备" />;
        case DeviceSystem.IOS:
            return <AppleFilled title="苹果设备" />;
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