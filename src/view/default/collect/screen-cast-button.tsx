import debounce from 'lodash/debounce';
import React, { FC, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDisplay } from '@fortawesome/free-solid-svg-icons';
import Button from 'antd/lib/button';
import DeviceType from '@/schema/device-type';
import { FetchState } from '@/schema/device-state';
import { ScreenCastButtonBox } from './styled/screen-cast-button-box';
import DeviceSystem from '@/schema/device-system';

/**
 * 投屏按钮
 */
const ScreenCastButton: FC<{
    data: DeviceType,
    clickHandle: (data: DeviceType) => void
}> = ({ data, clickHandle }) => {

    const isDisplay = (dev: DeviceType) => {

        if (dev.system === DeviceSystem.Android) {
            return dev.fetchState === FetchState.NotConnected || data.fetchState === FetchState.Waiting
                ? 'none'
                : 'flex';
        } else {
            return 'none';
        }
    };

    const onButtonClick = debounce((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        clickHandle(data);
    }, 3000, { leading: true, trailing: false });

    return <ScreenCastButtonBox
        style={{
            display: isDisplay(data)
        }}>
        <Button
            onClick={onButtonClick}
            type="link"
            size="small">
            <FontAwesomeIcon icon={faDisplay} />
            <span>投屏</span>
        </Button>
    </ScreenCastButtonBox>;
};

export { ScreenCastButton };