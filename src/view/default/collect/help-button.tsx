import debounce from 'lodash/debounce';
import React, { FC, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons/faCircleQuestion';
import Button from 'antd/lib/button';
import DeviceType from '@/schema/device-type';
import { HelpButtonBox } from './styled/help-button-box';

/**
 * 帮助按钮
 */
const HelpButton: FC<{
    data: DeviceType,
    clickHandle: (data: DeviceType) => void
}> = ({ data, clickHandle }) => {

    const isDisplay = (dev: DeviceType) => {

        return 'flex';
    };

    const onButtonClick = debounce((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        clickHandle(data);
    }, 3000, { leading: true, trailing: false });

    return <HelpButtonBox
        style={{
            display: isDisplay(data)
        }}>
        <Button
            onClick={onButtonClick}
            type="link"
            size="small">
            <FontAwesomeIcon icon={faCircleQuestion} />
            <span>帮助</span>
        </Button>
    </HelpButtonBox>;
};

export { HelpButton };