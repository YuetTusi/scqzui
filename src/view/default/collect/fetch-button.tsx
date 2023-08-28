import React, { FC, MouseEvent } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import { FetchState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchButtonProp } from './prop';

const {
    useFetch,
    useServerCloud,
    fetchText,
    fetchButtonText,
    cloudButtonText
} = helper.readConf()!;
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
            content: `确定停止${fetchText ?? '取证'}？`,
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
                <Auth deny={!useFetch}>
                    <Button
                        onClick={() => onNormalHandle(device)}
                        style={{ width: '100px' }}
                        type="primary">
                        {fetchButtonText ?? '取证'}
                    </Button>
                </Auth>
                <Auth deny={!useServerCloud}>
                    <Button
                        onClick={() => onServerCloudHandle(device)}
                        style={{ width: '100px' }}
                        type="primary">
                        {cloudButtonText ?? '云取证'}
                    </Button>
                </Auth>
            </Group>
        case FetchState.Fetching:
            return <Group>
                <Button
                    onClick={onStopClick}
                    type="primary"
                    disabled={device.isStopping}>
                    {device.isStopping ? '停止中' : `停止${fetchText ?? '取证'}`}
                </Button>
            </Group>;
        default:
            return <Group>
                <Auth deny={!useFetch}>
                    <Button
                        type="primary"
                        style={{ width: '100px' }}
                        disabled={true}>
                        {fetchButtonText ?? '取证'}
                    </Button>
                </Auth>
                <Auth deny={!useServerCloud}>
                    <Button
                        type="primary"
                        style={{ width: '100px' }}
                        disabled={true}>
                        {cloudButtonText ?? '云取证'}
                    </Button>
                </Auth>
            </Group>;
    }
};

FetchButton.defaultProps = {
    device: {},
    onHelpHandle: () => { },
    onNormalHandle: () => { },
    onServerCloudHandle: () => { },
    onStopHandle: () => { }
};

export { FetchButton };