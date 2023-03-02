import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWaveform } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { routerRedux, useDispatch, useSelector } from 'dva';
import AndroidOutlined from '@ant-design/icons/AndroidOutlined';
import AppleOutlined from '@ant-design/icons/AppleOutlined';
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import DoubleLeftOutlined from '@ant-design/icons/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons/DoubleRightOutlined';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import { useDstUnit, useUnit } from '@/hook/unit';
import { TipType } from '@/schema/tip-type';
import { FetchState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchData } from '@/schema/fetch-data';
import { DeviceType } from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import { DataMode } from '@/schema/data-mode';
import { CommandType, SocketType } from '@/schema/command';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { LiveModal } from '@/component/dialog/fetch-record-modal';
import {
    AppleCreditModal, UsbDebugModal, HelpModal, ApplePasswordModal,
    UMagicCodeModal, GuideModal, CloudCodeModal, CloudHistoryModal
} from '@/component/dialog';
import NormalInputModal from './normal-input-modal';
import CheckInputModal from './check-input-modal';
import ServerCloudModal from './server-cloud-modal';
import { ContentBox, DevicePanel } from './styled/content-box';
import { DeviceFrame } from './device-frame';
import { CollectProp } from './prop';


const { Group } = Button;
const { useBcp, devText, fetchText, parseText } = helper.readConf()!;

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
    const [liveModalVisible, setLiveModalVisible] = useState<boolean>(false);
    const [applePasswordVisible, setApplePasswordVisible] = useState<boolean>(false);
    const [uMagicCodeModalVisible, setUMagicCodeModalVisible] = useState<boolean>(false);
    const [guideModalVisible, setGuideModalVisible] = useState<boolean>(false);
    const [checkInputModalVisible, setCheckInputModalVisible] = useState<boolean>(false);
    const [cloudHistoryModalVisible, setCloudHistoryModalVisible] = useState<boolean>(false);
    const { dataMode } = useSelector<StateTree, AppSetStore>(state => state.appSet);
    const [unitCode] = useUnit();
    const [dstUnitCode] = useDstUnit();
    const devicePanelRef = useRef<HTMLDivElement>(null);
    const currentDevice = useRef<DeviceType | null>(null);

    // useEffect(() => {

    //     let devices: DeviceType[] = [];
    //     for (let i = 0; i < 10; i++) {
    //         devices.push({
    //             ...{
    //                 "fetchState": FetchState.Connected,
    //                 "manufacturer": "采集完成",
    //                 "model": "TAS-AL00",
    //                 "phoneInfo": [{
    //                     "name": "厂商", "value": "HUAWEI"
    //                 }, { "name": "型号", "value": "TAS-AL00" }, {
    //                     "name": "系统版本", "value": "10"
    //                 }, {
    //                     "name": "IMEI", "value": "867099041036009"
    //                 }],
    //                 "serial": "JTK0219826000164",
    //                 "system": "android",
    //                 "usb": i + 1,
    //                 "fetchPercent": 10 + i
    //             },
    //             parseState: ParseState.NotParse,
    //             isStopping: false
    //         } as DeviceType);
    //     }

    //     //mock:
    //     dispatch({
    //         type: 'device/setDeviceList', payload: devices
    //     });
    // }, []);

    useEffect(() => {
        const { current } = devicePanelRef;
        if (current !== null) {
            current.addEventListener('wheel', onDevicePanelWheel);
        }
        return () => {
            current!.removeEventListener('wheel', onDevicePanelWheel);
        };
    }, []);

    /**
     * 面板横向滚动控制
     */
    const onDevicePanelWheel = ({ deltaY }: WheelEvent) => {
        const { current } = devicePanelRef;
        if (current) {
            current.style.scrollBehavior = 'auto';
            current.scrollLeft += deltaY - 10;
        }
    };

    /**
     * 滚动按钮Click
     * @param to 方向
     */
    const onScrollButtonClick = (to: 'left' | 'right') => {
        const { current } = devicePanelRef;
        if (current) {
            current.style.scrollBehavior = 'smooth';
            switch (to) {
                case 'left':
                    current.scrollLeft -= 200;
                    break;
                case 'right':
                    current.scrollLeft += 200;
                    break;
                default:
                    console.warn(`Unknow ${to}`);
                    break;
            }
        }
    };

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
    };

    /**
     * 采集前验证相关设置
     */
    const validateBeforeFetch = () => {
        if (unitCode === undefined) {
            message.destroy();
            message.info({
                content: useBcp
                    ? '未设置采集单位，请在「软件设置」→「采集单位」中配置'
                    : '未设置采集单位，请在「软件设置」→「采集单位管理」中配置'
            });
            return false;
        }
        if (useBcp && dstUnitCode === undefined) {
            //军队版本无需验证目的检验单位
            message.destroy();
            message.info({
                content: '未设置目的检验单位，请在「软件设置」→「目的检验单位」中配置'
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
        switch (dataMode) {
            case DataMode.Self:
                //# 标准版本
                setNormalInputModal(true);
                break;
            case DataMode.Check:
                //# 点验版本
                const fetchData = await getDb<FetchData>(TableName.CheckData)
                    .findOne({ serial });
                if (fetchData === null) {
                    //TODO:完成点验功能后打开：
                    setCheckInputModalVisible(true);
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
        getCaseDataFromUser(data);
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
        setCheckInputModalVisible(false);
        setServerCloudModalVisible(false);
        //TODO: 关闭另两个输入框

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

    /**
     * 采集记录回调
     * @param {DeviceType} data
     */
    const recordHandle = (data: DeviceType) => {
        currentDevice.current = data;
        switch (data.mode) {
            case DataMode.ServerCloud:
                setCloudHistoryModalVisible(true);
                break;
            default:
                setLiveModalVisible(true);
                break;
        }
    };

    /**
     * 停止按钮回调
     * @param {DeviceType} data
     */
    const stopHandle = ({ usb }: DeviceType) => {
        ipcRenderer.send('time', usb! - 1, false);
        dispatch({
            type: 'device/updateProp',
            payload: {
                usb,
                name: 'isStopping',
                value: true
            }
        });
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.StopFetch,
            msg: { usb }
        });
    };

    /**
     * 显示云取证验证码详情框
     * @param data 当前设备数据
     */
    const showCloudCodeModal = ({ usb }: DeviceType) =>
        dispatch({
            type: 'cloudCodeModal/setVisible',
            payload: { usb, visible: true }
        });

    /**
     * 操作消息handle
     */
    const tipHandle = (data: DeviceType) => {
        if (data?.fetchState === FetchState.Fetching) {
            currentDevice.current = data;
            switch (data.tipType) {
                case TipType.Normal:
                case TipType.Flash:
                    //后台定制弹框
                    setGuideModalVisible(true);
                    break;
                case TipType.ApplePassword:
                    //iTunes备份密码确认弹框
                    setApplePasswordVisible(true);
                    break;
                case TipType.CloudCode:
                    //云取证验证码弹框
                    showCloudCodeModal(data);
                    break;
                case TipType.UMagicCode:
                    //联通验证码弹框
                    setUMagicCodeModalVisible(true);
                    break;
                default:
                    console.warn('未知TipType', data.tipType);
                    break;
            }
        }
    }

    /**
     * 用户未知密码放弃（type=2）
     * @param {number} usb USB序号
     */
    const applePasswordCancelHandle = (usb?: number) => {
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.TipReply,
            msg: {
                usb,
                password: '',
                type: 2,
                reply: ''
            }
        });
        setApplePasswordVisible(false);
    };
    /**
     * 用户输入密码确认(type=1)
     * @param {string} password 密码
     * @param {number} usb USB序号
     */
    const applePasswordConfirmHandle = (password: string, usb?: number) => {
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.TipReply,
            msg: {
                usb,
                password,
                type: 1,
                reply: ''
            }
        });
        setApplePasswordVisible(false);
    };
    /**
     * 用户未知密码继续(type=3)
     * @param {number} usb USB序号
     */
    const applePasswordWithoutPasswordHandle = (usb?: number) => {
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.TipReply,
            msg: {
                usb,
                password: '',
                type: 3,
                reply: ''
            }
        });
        setApplePasswordVisible(false);
    };

    /**
     * 发送联通验证码
     * @param usb USB序号
     * @param code 验证码
     */
    const uMagicCodeHandle = (usb: number, code: string) => {
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.UMagicCodeReply,
            msg: { usb, code }
        });
        setUMagicCodeModalVisible(false);
    };

    /**
     * 关闭联通验证码弹框
     */
    const uMagicModalCancelHandle = () => setUMagicCodeModalVisible(false);

    /**
     * 消息框用户反馈
     */
    const guideHandle = (value: any, { usb }: DeviceType) => {
        console.log(`#${usb}终端反馈:${JSON.stringify(value)}`);
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.TipReply,
            msg: {
                usb,
                reply: value,
                password: '',
                type: -1
            }
        });
        setGuideModalVisible(false);
    };

    /**
     * 关闭短信验证码弹框
     */
    const cloudCodeModalCancelHandle = () =>
        dispatch({
            type: 'cloudCodeModal/setVisible',
            payload: { visible: false }
        });

    /**
     * 点验输入框取消Click
     */
    const checkInputModalCancelHandle = () => {
        currentDevice.current = {};
        setCheckInputModalVisible(false);
    };

    return <SubLayout title={`${devText ?? '设备'}${fetchText ?? '取证'}`}>
        <ContentBox>
            <div className="hidden-scroll-bar" />
            <div className="button-bar">
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
                <Button onClick={() => dispatch(routerRedux.push('/parse'))} type="primary">
                    <FontAwesomeIcon
                        icon={faFileWaveform}
                        style={{ marginRight: '10px' }} />
                    <span>{`数据${parseText ?? '解析'}`}</span>
                </Button>
            </div>
            <Split />
            <DevicePanel ref={devicePanelRef}>
                <DeviceFrame
                    onHelpHandle={onHelpHandle}
                    onNormalHandle={collectHandle}
                    onServerCloudHandle={serverCloudHandle}
                    onRecordHandle={recordHandle}
                    onStopHandle={stopHandle}
                    onTipHandle={tipHandle}
                />
                <div
                    onClick={() => onScrollButtonClick('left')}
                    className="scroll-button left"
                    title="向左滚动">
                    <DoubleLeftOutlined />
                </div>
                <div
                    onClick={() => onScrollButtonClick('right')}
                    className="scroll-button right"
                    title="向右滚动">
                    <DoubleRightOutlined />
                </div>
            </DevicePanel>
        </ContentBox>
        <UsbDebugModal
            visible={usbDebugModalVisible}
            okHandle={() => setUsbDebugModalVisible(false)} />
        <AppleCreditModal
            visible={appCreditModalVisible}
            okHandle={() => setAppCreditModalVisible(false)} />
        <HelpModal
            visible={helpModalVisible}
            okHandle={() => setHelpModalVisible(false)}
            cancelHandle={() => setHelpModalVisible(false)}
        />
        <NormalInputModal
            device={currentDevice.current}
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
        <LiveModal
            visible={liveModalVisible}
            device={currentDevice.current}
            cancelHandle={() => setLiveModalVisible(false)}
        />
        <ApplePasswordModal
            visible={applePasswordVisible}
            device={currentDevice.current}
            cancelHandle={applePasswordCancelHandle}
            confirmHandle={applePasswordConfirmHandle}
            withoutPasswordHandle={applePasswordWithoutPasswordHandle}
            closeHandle={() => setApplePasswordVisible(false)} />
        <UMagicCodeModal
            visible={uMagicCodeModalVisible}
            device={currentDevice.current}
            okHandle={uMagicCodeHandle}
            closeHandle={uMagicModalCancelHandle}
        />
        <GuideModal
            visible={guideModalVisible}
            device={currentDevice.current}
            yesHandle={guideHandle}
            noHandle={guideHandle}
            cancelHandle={() => setGuideModalVisible(false)}
        />
        <CheckInputModal
            visible={checkInputModalVisible}
            device={currentDevice.current}
            saveHandle={startFetchHandle}
            cancelHandle={checkInputModalCancelHandle}
        />
        <CloudCodeModal
            device={currentDevice.current}
            cancelHandle={cloudCodeModalCancelHandle}
        />
        <CloudHistoryModal
            device={currentDevice.current}
            visible={cloudHistoryModalVisible}
            cancelHandle={() => setCloudHistoryModalVisible(false)}
        />
    </SubLayout>
};

export default Collect;