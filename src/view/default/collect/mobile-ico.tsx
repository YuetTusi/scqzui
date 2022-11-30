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

    switch (fetchState) {
        case FetchState.Fetching:
            return <Tooltip
                title={<InfoList phoneInfo={phoneInfo} usb={usb!} />}
                placement="top">
                <Progress
                    percent={fetchPercent}
                    status="normal"
                    type="circle"
                    strokeColor="#26e5dc" />
            </Tooltip>;
        case FetchState.Finished:
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
            </Tooltip>;
        case FetchState.HasError:
            return <Tooltip
                title={<InfoList phoneInfo={phoneInfo} usb={usb!} />}
                placement="top">
                <Progress
                    percent={fetchPercent}
                    format={() => '失败'}
                    status="success"
                    type="circle"
                    strokeColor="#ff4d4f" />
            </Tooltip>;
        default:
            if (system === DeviceSystem.IOS) {
                return <FontAwesomeIcon icon={faApple} />;
            } else if (system === DeviceSystem.Android) {
                return <FontAwesomeIcon icon={faAndroid} />;
            } else {
                return <FontAwesomeIcon icon={faQuestionCircle} />;
            }
    }
};

export { MobileIco };