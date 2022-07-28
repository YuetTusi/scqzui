import React, { FC } from "react";
import Progress from 'antd/lib/progress';
import Tooltip from 'antd/lib/tooltip';
import { DeviceType } from "@/schema/device-type";
import { DeviceSystem } from "@/schema/device-system";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { FetchState } from "@/schema/device-state";
import { helper } from "@/utils/helper";
import { PhoneInfoBox } from "./styled/device-box";

const InfoList: FC<{
    phoneInfo: {
        name: string;
        value: string;
    }[],
    usb: number
}> = ({ phoneInfo, usb }) => <PhoneInfoBox>
    {
        phoneInfo.map((item, index) => <li key={`INFO_${usb}_${index}`}>
            <label>{item.name}</label>
            <span>{item.value}</span>
        </li>)
    }
</PhoneInfoBox>

/**
 * 手机图标
 * 若为`采集中`状态则渲染进度条
 */
const MobileIco: FC<{ device: DeviceType }> = ({ device }) => {

    if (helper.isNullOrUndefined(device)) {
        return <FontAwesomeIcon icon={faQuestionCircle} />;
    }

    const { fetchState, system, fetchPercent, usb, phoneInfo = [] } = device;

    if (fetchState === FetchState.Fetching) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Tooltip
            title={<InfoList phoneInfo={phoneInfo} usb={usb!} />}
            placement="top">
            <Progress
                percent={fetchPercent}
                status="normal"
                type="circle"
                strokeColor="#26e5dc" />
        </Tooltip>
    }
    else if (fetchState === FetchState.Finished) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Tooltip
            title={<InfoList phoneInfo={phoneInfo} usb={usb!} />}
            placement="top">
            <Progress
                percent={fetchPercent}
                format={() => '完成'}
                success={{ percent: 100, strokeColor: '#26e5dc' }}
                status="success"
                type="circle"
                strokeColor="#26e5dc" />
        </Tooltip>
    }
    else if (fetchState === FetchState.HasError) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Tooltip
            title={<InfoList phoneInfo={phoneInfo} usb={usb!} />}
            placement="top">
            <Progress
                percent={fetchPercent}
                format={() => '失败'}
                status="success"
                type="circle"
                strokeColor="#ff4d4f" />
        </Tooltip>
    }
    else {
        switch (system) {
            case DeviceSystem.Android:
                return <FontAwesomeIcon icon={faAndroid} />;
            case DeviceSystem.IOS:
                return <FontAwesomeIcon icon={faApple} />;
            default:
                return <FontAwesomeIcon icon={faQuestionCircle} />;
        }
    }

};

export { MobileIco };