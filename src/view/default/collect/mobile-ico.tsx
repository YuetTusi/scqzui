import React, { FC } from "react";
import Progress from 'antd/lib/progress';
import { DeviceType } from "@/schema/device-type";
import { DeviceSystem } from "@/schema/device-system";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { FetchState } from "@/schema/device-state";

/**
 * 手机图标
 * 若为`采集中`状态则渲染进度条
 */
const MobileIco: FC<{ device: DeviceType }> = ({ device }) => {

    const { fetchState, system, fetchPercent } = device;

    if (fetchState === FetchState.Fetching) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Progress percent={fetchPercent} status="normal" type="circle" strokeColor="#26e5dc" />
    }
    else if (fetchState === FetchState.Finished) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Progress
            percent={fetchPercent}
            format={() => '完成'}
            success={{ percent: 100, strokeColor: '#26e5dc' }}
            status="success"
            type="circle"
            strokeColor="#26e5dc" />
    }
    else if (fetchState === FetchState.HasError) {
        //`采集中`或`完成`状态时显示进度条组件
        return <Progress
            percent={fetchPercent}
            format={() => '失败'}
            status="success"
            type="circle"
            strokeColor="#ff4d4f" />
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