import React, { FC } from 'react';
import { DeviceType } from '@/schema/device-type';
import { ParseDetail } from '@/schema/parse-detail';
import { helper } from '@/utils/helper';

const { devText } = helper.readConf()!;

/**
 * 正在解析设备
 */
const ParseDev: FC<{ devices: DeviceType[], detail?: ParseDetail }> = ({
    devices, detail
}) => {
    const dev = devices.find(item => item._id === detail?.deviceId);
    return <ul>
        <li>
            <label>{`${devText ?? '设备'}名称`}</label>
            <span>{dev?.mobileName === undefined ? '' : dev?.mobileName.split('_')[0]}</span>
        </li>
        <li>
            <label>持有人</label>
            <span>{dev?.mobileHolder ?? ''}</span>
        </li>
        <li>
            <label>编号</label>
            <span>{dev?.mobileNo ?? ''}</span>
        </li>
        <li>
            <label>备注</label>
            <span>{dev?.note ?? ''}</span>
        </li>
    </ul>;
};

ParseDev.defaultProps = {
    devices: []
};

export { ParseDev };