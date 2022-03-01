import { IpcRendererEvent } from 'electron';
import React, { FC, useState, memo } from 'react';
import { useSubscribe } from '@/hook';
import { helper } from '@/utils/helper';
import { ClockBox } from './styled/style';

interface ClockProp {
    /**
     * USB序号（从0开始）
     */
    usb: number
}

const prevTimeStringMap = new Map<number, string>();
const { max } = helper.readConf()!;

for (let i = 0; i < max; i++) {
    prevTimeStringMap.set(i, '00:00:00');
}

/**
 * 计时时钟 (时钟序号从0开始)
 */
const Clock: FC<ClockProp> = ({ usb }) => {
    const [timeString, setTimeString] = useState<string>(prevTimeStringMap.get(usb)!);

    const timeHandle = (event: IpcRendererEvent, currentUsb: number, timeString: string) => {
        if (usb === currentUsb) {
            setTimeString(timeString);
            prevTimeStringMap.set(usb, timeString);
        }
    };

    useSubscribe('receive-time', timeHandle);

    return (
        <ClockBox>
            {timeString}
        </ClockBox>
    );
};

Clock.defaultProps = {
    usb: 0
};

export default memo(Clock);
