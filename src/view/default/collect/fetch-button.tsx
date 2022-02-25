import React, { FC } from 'react';
import Button from 'antd/lib/button';
import { FetchState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchButtonProp } from './prop';

const { Group } = Button;

/**
 * 按钮区
 */
const FetchButton: FC<FetchButtonProp> = ({ device, onHelpHandle }) => {

    switch (device.fetchState) {
        case FetchState.NotConnected:
            return <Group>
                <Button onClick={() => onHelpHandle(DeviceSystem.Android)} type="primary">安卓帮助</Button>
                <Button onClick={() => onHelpHandle(DeviceSystem.IOS)} type="primary">苹果帮助</Button>
            </Group>;
        case FetchState.Connected:
        case FetchState.Finished:
            return <Group>
                <Button onClick={() => { }} style={{ width: '100px' }} type="primary">取证</Button>
                <Button onClick={() => { }} style={{ width: '100px' }} type="primary">云取证</Button>
            </Group>
        case FetchState.Fetching:
            return <Group>
                <Button onClick={() => { }} type="primary" disabled={device.isStopping}>停止取证</Button>
            </Group>;
        default:
            return <Group>
                <Button type="primary" style={{ width: '100px' }} disabled={true}>取证</Button>
                <Button type="primary" style={{ width: '100px' }} disabled={true}>云取证</Button>
            </Group>;
    }
};

export { FetchButton };