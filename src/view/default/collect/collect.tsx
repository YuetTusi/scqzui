import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import AndroidOutlined from '@ant-design/icons/AndroidOutlined';
import AppleOutlined from '@ant-design/icons/AppleOutlined';
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import Button from 'antd/lib/button';
import { DeviceSystem } from '@/schema/device-system';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { AppleCreditModal, UsbDebugModal, HelpModal } from '@/component/dialog';
import { ContentBox, DevicePanel } from './styled/content-box';
import { DeviceFrame } from './device-frame';
import { CollectProp } from './prop';

const { Group } = Button;

/**
 * 取证页
 */
const Collect: FC<CollectProp> = ({ }) => {

    const dispatch = useDispatch();
    const [appCreditModalVisible, setAppCreditModalVisible] = useState<boolean>(false);
    const [usbDebugModalVisible, setUsbDebugModalVisible] = useState<boolean>(false);
    const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);

    // useEffect(() => {

    //     //mock:
    //     dispatch({
    //         type: 'device/setDeviceToList', payload: {
    //             ...{
    //                 "fetchState": "Connected",
    //                 "manufacturer": "HUAWEI",
    //                 "model": "TAS-AL00",
    //                 "phoneInfo": [{
    //                     "name": "厂商", "value": "HUAWEI"
    //                 }, { "name": "型号", "value": "TAS-AL00" }, {
    //                     "name": "系统版本", "value": "10"
    //                 }, {
    //                     "name": "IMEI", "value": "867099041036009"
    //                 }],
    //                 "serial": "JTK0219826000164",
    //                 "system":
    //                     "android", "usb": 2
    //             },
    //             tipType: TipType.Nothing,
    //             parseState: ParseState.NotParse,
    //             isStopping: false
    //         }
    //     });
    // }, []);

    /**
     * 设备帮助handle
     * @param os 设备系统
     */
    const onHelpHandle = (os: DeviceSystem) => {
        switch (os) {
            case DeviceSystem.Android:
                setUsbDebugModalVisible(true);
                break;
            case DeviceSystem.IOS:
                setAppCreditModalVisible(true);
                break;
            default:
                console.warn(`未知设备系统:${os}`);
                break;
        }
    }

    return <SubLayout title="设备取证">
        <ContentBox>
            <div>
                <Group>
                    <Button onClick={() => setUsbDebugModalVisible(true)} type="primary">
                        <AndroidOutlined />
                        <span>开启USB调试</span>
                    </Button>
                    <Button onClick={() => setAppCreditModalVisible(true)} type="primary">
                        <AppleOutlined />
                        <span>Apple授权</span>
                    </Button>
                    <Button onClick={() => setHelpModalVisible(true)} type="primary">
                        <QuestionOutlined />
                        <span>操作帮助</span>
                    </Button>
                </Group>
            </div>
            <Split />
            <DevicePanel>
                <DeviceFrame
                    onHelpHandle={onHelpHandle}
                />
            </DevicePanel>
        </ContentBox>
        <UsbDebugModal visible={usbDebugModalVisible} okHandle={() => setUsbDebugModalVisible(false)} />
        <AppleCreditModal
            visible={appCreditModalVisible}
            okHandle={() => setAppCreditModalVisible(false)} />
        <HelpModal
            visible={helpModalVisible}
            okHandle={() => setHelpModalVisible(false)}
            cancelHandle={() => setHelpModalVisible(false)}
        />
    </SubLayout>
};

export default Collect;