import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'dva';
import AndroidOutlined from '@ant-design/icons/AndroidOutlined';
import AppleOutlined from '@ant-design/icons/AppleOutlined';
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import { TipType } from '@/schema/tip-type';
import { ParseState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchData } from '@/schema/fetch-data';
import { DeviceType } from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import { DataMode } from '@/schema/data-mode';
import { Db } from '@/utils/db';
import { LocalStoreKey } from '@/utils/local-store';
import { helper } from '@/utils/helper';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { AppleCreditModal, UsbDebugModal, HelpModal } from '@/component/dialog';
import NormalInputModal from './normal-input-modal';
import ServerCloudModal from './server-cloud-modal';
import { ContentBox, DevicePanel } from './styled/content-box';
import { DeviceFrame } from './device-frame';
import { CollectProp } from './prop';


const { Group } = Button;
const { useBcp } = helper.readConf()!;

/**
 * 取证页
 */
const Collect: FC<CollectProp> = ({ }) => {

    const dispatch = useDispatch();
    const [appCreditModalVisible, setAppCreditModalVisible] = useState<boolean>(false);
    const [usbDebugModalVisible, setUsbDebugModalVisible] = useState<boolean>(false);
    const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);
    const [normalInputModal, setNormalInputModal] = useState<boolean>(false);
    const [serverCloudModalVisible, setServerCloudModalVisible] = useState<boolean>(false);
    const currentDevice = useRef<DeviceType | null>(null);
    const dataMode = useRef<DataMode>(DataMode.Self);

    useEffect(() => {

        //mock:
        dispatch({
            type: 'device/setDeviceToList', payload: {
                ...{
                    "fetchState": "Connected",
                    "manufacturer": "HUAWEI",
                    "model": "TAS-AL00",
                    "phoneInfo": [{
                        "name": "厂商", "value": "HUAWEI"
                    }, { "name": "型号", "value": "TAS-AL00" }, {
                        "name": "系统版本", "value": "10"
                    }, {
                        "name": "IMEI", "value": "867099041036009"
                    }],
                    "serial": "JTK0219826000164",
                    "system":
                        "android", "usb": 2
                },
                tipType: TipType.Nothing,
                parseState: ParseState.NotParse,
                isStopping: false
            }
        });
    }, []);

    useEffect(() => {
        let mode = localStorage.getItem(LocalStoreKey.DataMode);
        if (mode === null) {
            dataMode.current = DataMode.Self;
        } else {
            dataMode.current = Number(mode);
        }
    }, []);

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

    /**
     * 通过警综平台获取数据
     * @param data
     */
    const getCaseDataFromGuangZhouPlatform = (data: DeviceType) => {
        //todo: 待创建保存sendCase的model
        // const { sendCase } = this.props.dashboard;
        if (helper.isNullOrUndefined(null)) {
            message.destroy();
            message.info('未接收警综平台数据');
        } else {
            dispatch({
                type: 'device/saveCaseFromPlatform',
                payload: { device: data }
            });
        }
    };

    /**
     * 采集前验证相关设置
     */
    const validateBeforeFetch = () => {
        if (helper.getUnit() === null) {
            message.info({
                content: useBcp
                    ? '未设置采集单位，请在「设置」→「采集单位」中配置'
                    : '未设置单位，请在「设置」→「单位管理」中配置'
            });
            return false;
        }
        if (useBcp && helper.getDstUnit() === null) {
            //军队版本无需验证目的检验单位
            message.info({
                content: '未设置目的检验单位，请在「设置」→「目的检验单位」中配置'
            });
            return false;
        }
        return true;
    };

    /**
     * 用户通过弹框手输数据
     * @param {DeviceType} data 采集数据
     */
    const getCaseDataFromUser = async ({ usb, serial }: DeviceType) => {
        if (!validateBeforeFetch()) {
            return;
        }
        switch (dataMode.current) {
            case DataMode.Self:
                //# 标准版本
                setNormalInputModal(true);
                break;
            case DataMode.Check:
                //# 点验版本
                const fetchData = await new Db<FetchData>(TableName.CheckData)
                    .findOne({ serial });
                if (fetchData === null) {
                    //todo:完成点验功能后打开：
                    // this.setState({ checkModalVisible: true });
                } else {
                    //note:如果数据库中存在此设备，直接走采集流程
                    const [name] = fetchData.mobileName!.split('_');
                    //*重新生成时间戳并加入偏移量，否则手速太快会造成时间一样覆盖目录
                    fetchData.mobileName = `${name}_${helper.timestamp(usb)}`;
                    startFetchHandle(fetchData);
                }
                break;
            default:
                //# 标准版本
                setNormalInputModal(true);
                break;
        }
    };

    /**
     * 取证按钮回调（采集一部手机）
     * @param {DeviceType} data 设备数据
     */
    const collectHandle = (data: DeviceType) => {
        currentDevice.current = data; //寄存手机数据，采集时会使用
        switch (dataMode.current) {
            case DataMode.GuangZhou:
                //#广州警综平台
                getCaseDataFromGuangZhouPlatform(data);
                break;
            default:
                //#标准或点验模式
                getCaseDataFromUser(data);
                break;
        }
    };
    /**
     * 云取证回调
     * @param {DeviceType} data 设备数据
     */
    const serverCloudHandle = (data: DeviceType) => {
        if (!validateBeforeFetch()) {
            return;
        }
        currentDevice.current = data; //寄存手机数据，采集时会使用
        setServerCloudModalVisible(true);
    };

    /**
     * 开始采集（3种取证入口共用此回调）
     * @param {FetchData} fetchData 采集数据
     */
    const startFetchHandle = (fetchData: FetchData) => {
        setNormalInputModal(false);
        setServerCloudModalVisible(false);
        //todo: 关闭另两个输入框

        if (fetchData.mode === DataMode.ServerCloud) {
            //#云取证把应用数据赋值给cloudCodeModal模型，以接收验证码详情
            const { usb } = currentDevice.current!;
            dispatch({
                type: 'cloudCodeModal/setApps',
                payload: {
                    usb,
                    mobileHolder: fetchData.mobileHolder,
                    mobileNumber: fetchData.mobileNumber,
                    apps: fetchData.cloudAppList
                }
            });
        }
        dispatch({
            type: 'device/startFetch',
            payload: {
                deviceData: currentDevice.current,
                fetchData
            }
        });
    };

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
                    onNormalHandle={collectHandle}
                    onServerCloudHandle={serverCloudHandle}
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
        <NormalInputModal
            visible={normalInputModal}
            saveHandle={startFetchHandle}
            cancelHandle={() => setNormalInputModal(false)}
        />
        <ServerCloudModal
            visible={serverCloudModalVisible}
            device={currentDevice.current}
            saveHandle={startFetchHandle}
            cancelHandle={() => setServerCloudModalVisible(false)}
        />
    </SubLayout>
};

export default Collect;