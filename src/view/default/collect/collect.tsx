import { join } from 'path';
import { ipcRenderer, shell } from 'electron';
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
import Modal from 'antd/lib/modal';
import { useDstUnit, useUnit } from '@/hook/unit';
import { TipType } from '@/schema/tip-type';
import { FetchState, ParseState } from '@/schema/device-state';
import { DeviceSystem } from '@/schema/device-system';
import { FetchData } from '@/schema/fetch-data';
import { DeviceType } from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import { DataMode } from '@/schema/data-mode';
import { CommandType, SocketType } from '@/schema/command';
import { BeforeFetchStatus } from '@/schema/before-fetch-status';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { LiveModal } from '@/component/dialog';
import {
    AppleCreditModal, HelpModal, ApplePasswordModal,
    UMagicCodeModal, GuideModal, CloudCodeModal, CloudHistoryModal
} from '@/component/dialog';
import Auth from '@/component/auth';
import NormalInputModal from './normal-input-modal';
import CheckInputModal from './check-input-modal';
import ServerCloudModal from './server-cloud-modal';
import { ContentBox, DevicePanel } from './styled/content-box';
import { DeviceFrame } from './device-frame';
import { CollectProp } from './prop';
import GuideImage from '@/schema/guide-image';

const { Group } = Button;
const { useBcp, devText, fetchText, parseText } = helper.readConf()!;

/**
 * 取证页
 */
const Collect: FC<CollectProp> = ({ }) => {

    const dispatch = useDispatch();
    const [wired, setWired] = useState<boolean>(false);
    const [appCreditModalVisible, setAppCreditModalVisible] = useState<boolean>(false);
    // const [normalInputModal, setNormalInputModal] = useState<boolean>(false);
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
    //     for (let i = 0; i < 3; i++) {
    //         devices.push({
    //             ...{
    //                 "fetchState": FetchState.Fetching,
    //                 "manufacturer": "Mi",
    //                 "model": "TAS-AL00",
    //                 "phoneInfo": [{
    //                     "name": "厂商", "value": "HUAWEI"
    //                 }, { "name": "型号", "value": "TAS-AL00" }, {
    //                     "name": "系统版本", "value": "10"
    //                 }, {
    //                     "name": "IMEI2", "value": "867099041036009"
    //                 }, {
    //                     "name": "MEID", "value": "867099041000000"
    //                 }],
    //                 "methods": [
    //                     { "name": "Apk快速采集", "value": "0", "tip": "提示内容测试" },
    //                     { "name": "华为Hisuite", "value": "1", "tip": "华为Hisuite" },
    //                     { "name": `测试${i}`, "value": "2", "tip": "测试" }
    //                 ],
    //                 "tipType": TipType.WiFi,
    //                 "tipTitle": "测试标题",
    //                 // "tipContent": "测试内容",
    //                 "tipImage": GuideImage.MiReplace,
    //                 "tipYesButton": { "name": "是", "value": "1" },
    //                 "serial": "JTK0219826000164",
    //                 "system": DeviceSystem.HarmonyOS,
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
            current.addEventListener('wheel', onDevicePanelWheel, { passive: true });
        }
        return () => {
            current!.removeEventListener('wheel', onDevicePanelWheel);
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const isWired = await helper.isWired();
                setWired(isWired);
            } catch (error) {
                setWired(false);
            }
        })();
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
                    console.warn(`Unknown ${to}`);
                    break;
            }
        }
    };

    /**
     * 设备帮助handle
     * @param os 设备系统
     */
    const onHelpHandle = async (os: DeviceSystem) => {
        switch (os) {
            case DeviceSystem.Android:
                try {
                    const exist = await helper.existFile(join(helper.APP_CWD, './resources/help/手机厂家手机取证操作.pdf'));
                    if (exist) {
                        await shell.openPath(join(helper.APP_CWD, './resources/help/手机厂家手机取证操作.pdf'));
                    } else {
                        message.destroy();
                        message.info('暂未提供帮助文档');
                    }
                } catch (error) {
                    console.warn(error);
                }
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
    const getCaseDataFromUser = async (device: DeviceType) => {
        if (!validateBeforeFetch()) {
            return;
        }

        switch (dataMode) {
            case DataMode.Self:
                //# 标准版本
                dispatch({ type: 'normalInputModal/setDevice', payload: device });
                dispatch({ type: 'normalInputModal/setOpen', payload: true });
                break;
            case DataMode.Check:
                //# 点验版本
                const fetchData = await getDb<FetchData>(TableName.CheckData)
                    .findOne({ serial: device.serial });
                if (fetchData === null) {
                    //TODO:完成点验功能后打开：
                    setCheckInputModalVisible(true);
                } else {
                    //note:如果数据库中存在此设备，直接走采集流程
                    const [name] = fetchData.mobileName!.split('_');
                    //*重新生成时间戳并加入偏移量，否则手速太快会造成时间一样覆盖目录
                    fetchData.mobileName = `${name}_${helper.timestamp(device.usb)}`;
                    startFetchHandle(fetchData);
                }
                break;
            default:
                //# 标准版本
                dispatch({ type: 'normalInputModal/setOpen', payload: true });
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

        switch (fetchData.mode) {
            case DataMode.Self:
                //发送校验命令，后台允许走采集流程
                send(SocketType.Fetch, {
                    cmd: CommandType.FetchVerify,
                    msg: {
                        deviceData: currentDevice.current,
                        fetchData
                    }
                });
                dispatch({ type: 'normalInputModal/setFetchAllow', payload: BeforeFetchStatus.Verifying });

                // setTimeout(() => {
                //     fetchVerify({
                //         type: 'fetch',
                //         cmd: CommandType.FetchVerify,
                //         msg: {
                //             deviceData: currentDevice.current,
                //             fetchData,
                //             allow: false,
                //             info: '不允许'
                //         }
                //     } as any, dispatch);
                // }, 3000);
                break;
            case DataMode.ServerCloud:
                setServerCloudModalVisible(false);
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
                dispatch({
                    type: 'device/startFetch',
                    payload: {
                        deviceData: currentDevice.current,
                        fetchData
                    }
                });
                break;
            case DataMode.Check:
                setCheckInputModalVisible(false);
                dispatch({
                    type: 'device/startFetch',
                    payload: {
                        deviceData: currentDevice.current,
                        fetchData
                    }
                });
                break;
        }

        dispatch({ type: 'fetchStateModal/clearData', payload: currentDevice.current!.usb });
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
                case TipType.WiFi:
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
                case TipType.Lead:
                    Modal.confirm({
                        onOk() {
                            send(SocketType.Fetch, {
                                type: SocketType.Fetch,
                                cmd: CommandType.LeadReply,
                                msg: {}
                            });
                        },
                        okText: '确定',
                        cancelText: '取消',
                        title: data.tipTitle ?? '提示',
                        content: data.tipContent ?? '',
                        centered: true
                    });
                    break;
                default:
                    console.warn('未知TipType', data.tipType);
                    break;
            }
        }
    };

    /**
     * 投屏handle
     */
    const castScreenHandle = (data: DeviceType) => {
        message.destroy();
        message.info(`终端${data.usb ?? 0}设备投屏`);
        send(SocketType.Fetch, {
            type: SocketType.Fetch,
            cmd: CommandType.DevCast,
            msg: {
                id: data.usb ?? 0
            }
        });
    };

    /**
     * 帮助handle
     */
    const helpHandle = (data: DeviceType) => {
        dispatch({ type: 'helpModal/setManufacturer', payload: data.manufacturer });
        dispatch({ type: 'helpModal/setOpen', payload: true });
    };

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
                    <Button onClick={() => onHelpHandle(DeviceSystem.Android)} type="primary">
                        <AndroidOutlined />
                        <span>开启USB调试</span>
                    </Button>
                    <Button onClick={() => setAppCreditModalVisible(true)} type="primary">
                        <AppleOutlined />
                        <span>Apple授权</span>
                    </Button>
                    <Button onClick={() => dispatch({ type: 'helpModal/setOpen', payload: true })} type="primary">
                        <QuestionOutlined />
                        <span>操作帮助</span>
                    </Button>
                </Group>
                <Group>
                    <Auth deny={!wired}>
                        <Button onClick={() => dispatch(routerRedux.push('/quick'))} type="primary">
                            <FontAwesomeIcon
                                icon={faFileWaveform}
                                style={{ marginRight: '10px' }} />
                            <span>{`快采数据${parseText ?? '解析'}`}</span>
                        </Button>
                    </Auth>
                    <Button onClick={() => dispatch(routerRedux.push('/parse'))} type="primary">
                        <FontAwesomeIcon
                            icon={faFileWaveform}
                            style={{ marginRight: '10px' }} />
                        <span>{`数据${parseText ?? '解析'}`}</span>
                    </Button>
                </Group>
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
                    castScreenHandle={castScreenHandle}
                    helpHandle={helpHandle}
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
        <AppleCreditModal
            visible={appCreditModalVisible}
            okHandle={() => setAppCreditModalVisible(false)} />
        <HelpModal
            okHandle={() => dispatch({ type: 'helpModal/setOpen', payload: false })}
            cancelHandle={() => dispatch({ type: 'helpModal/setOpen', payload: false })}
        />
        <NormalInputModal
            saveHandle={startFetchHandle}
            cancelHandle={() => dispatch({ type: 'normalInputModal/setOpen', payload: false })}
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