import React, { FC, MouseEvent } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { FetchState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchButtonProp } from './prop';

const { Group } = Button;

/**
 * 按钮区
 */
const FetchButton: FC<FetchButtonProp> = ({
    device,
    onHelpHandle,
    onNormalHandle,
    onServerCloudHandle,
    onStopHandle
}) => {

    /**
     * 停止取证Click
     * @param event 事件对象
     */
    const onStopClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        Modal.confirm({
            title: '停止',
            content: '确定停止取证？',
            okText: '是',
            cancelText: '否',
            centered: true,
            onOk() {
                onStopHandle(device);
            }
        });
    }

    switch (device?.fetchState) {
        case FetchState.NotConnected:
            return <Group>
                <Button onClick={() => onHelpHandle(DeviceSystem.Android)} type="primary">安卓帮助</Button>
                <Button onClick={() => onHelpHandle(DeviceSystem.IOS)} type="primary">苹果帮助</Button>
            </Group>;
        case FetchState.Connected:
        case FetchState.Finished:
        case FetchState.HasError:
            return <Group>
                <Button onClick={() => onNormalHandle(device)} style={{ width: '100px' }} type="primary">取证</Button>
                <Button onClick={() => onServerCloudHandle(device)} style={{ width: '100px' }} type="primary">云取证</Button>
            </Group>
        case FetchState.Fetching:
            return <Group>
                <Button
                    onClick={onStopClick}
                    type="primary"
                    disabled={device.isStopping}>
                    {device.isStopping ? '停止中' : '停止取证'}
                </Button>
            </Group>;
        default:
            return <Group>
                <Button type="primary" style={{ width: '100px' }} disabled={true}>取证</Button>
                <Button type="primary" style={{ width: '100px' }} disabled={true}>云取证</Button>
            </Group>;
    }
};

export { FetchButton };