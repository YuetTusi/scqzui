import React, { FC, MouseEvent } from 'react';
import { helper } from '@/utils/helper';
import DeviceType from '@/schema/device-type';
import { DeviceListBox } from './styled/box';

/**
 * 设备列表
 */
const DeviceList: FC<{
    data: DeviceType[],
    onClick: (id: string) => void
}> = ({ data, onClick }) => {

    const onLiClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onClick((event.target as any).dataset['id']);
    };

    const render = () => {
        return data.map((item, index) => {
            return <li
                onClick={onLiClick}
                key={`DL_${item._id}`} >
                <span data-id={item._id}>
                    {helper.getNameWithoutTime(item.mobileName)}
                </span>
            </li>
        });
    };

    return <DeviceListBox>
        <ul>{render()}</ul>
    </DeviceListBox>;
};

export { DeviceList };