import debounce from 'lodash/debounce';
import { shell } from 'electron';
import { join, resolve } from 'path';
import React, { FC, useCallback, useRef, useReducer, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import FundViewOutlined from '@ant-design/icons/FundViewOutlined';
import UnlockOutlined from '@ant-design/icons/UnlockOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSquarePhone, faFileArrowDown, faUnlockKeyhole, faUsers, faSimCard, faSdCard, faMobileRetro
} from '@fortawesome/free-solid-svg-icons';
import {
    faApple, faAndroid, faItunes, faBlackberry, faAlipay, faWeixin
} from '@fortawesome/free-brands-svg-icons';
import Auth from '@/component/auth';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import AlipayOrderModal from './alipay-order-modal';
import ImportDataModal from './import-data-modal';
import CrackModal from './crack-modal';
import ApkModal from './apk-modal';
import QrcodeCloudModal from './qrcode-cloud-modal';
import ChinaMobileModal from './china-mobile-modal';
import {
    AiSimilarModal, fakeFeaturePhoneModal, FakeImportModal,
    ImportBak
} from './fake';
import MiChangeModal from './mi-change-modal';
import HuaweiCloneModal from './huawei-clone-modal';
import AndroidSetModal, { SetType } from './android-set-modal';
import { SnapshotModal } from './snapshot-modal';
import { SortBox, ToolBox } from './styled/style';
import { ImportTypes } from '@/schema/import-type';
import huaweiSvg from './styled/images/huawei.svg';
import honorSvg from './styled/images/honor.svg';
import umagicSvg from './styled/images/umagic.svg';
import oppoSvg from './styled/images/oppo.svg';
import vivoSvg from './styled/images/vivo.svg';
import miSvg from './styled/images/mi.svg';
import miChangePng from './styled/images/michange.png';
import symbianSvg from './styled/images/symbian.svg';
import windowsmobileSvg from './styled/images/windowsmobile.svg';
import windowsphoneSvg from './styled/images/windowsphone.svg';
import badaSvg from './styled/images/bada.svg';
import featurephoneSvg from './styled/images/featurephone.svg';
import meegoSvg from './styled/images/meego.svg';
import hwcopyPng from './styled/images/hwcopy.png';
import samsungSmartswitch from './styled/images/samsung_smartswitch.png';
import apkSvg from './styled/images/apk.svg';
import ccbSvg from './styled/images/ccb.svg';
import chinaMobileSvg from './styled/images/chinamobile.svg';
import androidAuthSvg from './styled/images/android_auth.svg';
import cloudSearchSvg from './styled/images/cloud-search.svg';
import userSearchSvg from './styled/images/user-search.svg';
import { CrackTypes } from './crack-modal/prop';
import { ExeType, Action, ModalOpenState, ToolProp } from './prop';

const cwd = process.cwd();
const { useFakeButton } = helper.readConf()!;

/**
 * 工具箱
 */
const Tool: FC<ToolProp> = () => {

    const dispatch = useDispatch();
    const currentCrackType = useRef(CrackTypes.VivoAppLock);
    const currentSetType = useRef(SetType.PickAuth);
    const [modalState, dispatchModal] = useReducer(
        (state: ModalOpenState, { type, payload }: Action) => ({
            ...state, [type]: payload
        }), {
        alipayOrderModalVisible: false,
        aiSimilarModalVisible: false,
        crackModalVisible: false,
        miChangeModalVisible: false,
        huaweiCloneModalVisible: false,
        fakeImportModalVisible: false,
        snapshotModalVisible: false,
        apkModalVisible: false,
        qrcodeCloudModalVisible: false,
        chinaMobileModalVisible: false,
        androidSetModalVisible: false
    });

    /** 
     * 支付宝云取取消handle
     */
    const alipayOrderModalCancelHandle = useCallback(() => {
        dispatchModal({ type: 'alipayOrderModalVisible', payload: false });
    }, [modalState.alipayOrderModalVisible]);

    /**
     * 支付宝云取确定handle
     */
    const alipayOrderModalSaveHandle = useCallback((data: { savePath: string }) => {
        message.info('正在启动云取程序...请稍后');
        helper
            .runExe(join(cwd, '../tools/yuntools/alipay_yun.exe'), [data.savePath])
            .then(() => message.destroy())
            .catch((err) => {
                message.destroy();
                message.error(`启动云取程序失败: ${err.message}`);
            });
        dispatchModal({ type: 'alipayOrderModalVisible', payload: false });
    }, [modalState.alipayOrderModalVisible]);

    /**
     * 应用锁破解按钮Click
     * @param event 事件对象
     * @param type 破解类型
     */
    const crackLiClick = (_: MouseEvent<HTMLDivElement>, type: CrackTypes) => {
        currentCrackType.current = type;
        dispatchModal({ type: 'crackModalVisible', payload: true });
    };

    /**
     * 打开三星帮助文档
     */
    const showPdfHelpClick = debounce(async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const url = helper.IS_DEV
            ? join(cwd, './data/help/三星手机操作说明.pdf')
            : join(cwd, './resources/help/三星手机操作说明.pdf');
        try {
            const exist = await helper.existFile(url);
            message.destroy();
            if (exist) {
                message.info('正在打开帮助文档...');
                await shell.openPath(url);
            } else {
                message.info('暂未提供帮助文档');
            }
        } catch (error) {
            console.warn(error);
        }
    }, 1000, { leading: true, trailing: false });

    /**
     * 导入按钮click
     * @param type 类型
     * @param title 标题
     */
    const onImportClick = (type: ImportTypes, title: string) => {
        switch (type) {
            case ImportTypes.Samsung_Smartswitch:
                dispatch({
                    type: 'importDataModal/setTips',
                    payload: [
                        <a onClick={showPdfHelpClick}>
                            请先使用S换机助手并按照「提示」
                            备份数据后进行导入
                            <strong title="点击打开帮助文档">
                                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />查看帮助
                            </strong>
                        </a>,
                        <span>导入<strong>包含「backupHistoryInfo.xml」文件</strong>的目录</span>,
                        <span>目前仅支持<strong>Android12及以上</strong></span>
                    ]
                });
                break;
            default:
                dispatch({
                    type: 'importDataModal/setTips',
                    payload: []
                });
                break;
        }
        dispatch({ type: 'importDataModal/setTitle', payload: title });
        dispatch({ type: 'importDataModal/setImportType', payload: type });
        dispatch({ type: 'importDataModal/setVisible', payload: true });
    };

    /**
     * 运行exe
     */
    const runExeHandle = (type: ExeType) => {
        let exePath: string | null = null;
        message.info('正在启动工具，请稍等...');
        switch (type) {
            case ExeType.ChatDownload:
                exePath = join(cwd, '../tools/export_chat/export_chat.exe');
                break;
            case ExeType.CallRecord:
                exePath = join(cwd, '../tools/ExportTool/ExportTool.exe');
                break;
            case ExeType.HuaweiPassword:
                exePath = join(cwd, '../tools/Defender/defender.exe');
                break;
            default:
                console.log(`未知type:${type}`);
                break;
        }
        if (exePath) {
            helper
                .runExe(exePath)
                .catch((errMsg: string) => {
                    console.log(errMsg);
                    message.destroy();
                    message.error('启动失败');
                });
        }
    };

    /**
     * 运行小米换机exe
     */
    const runMiChangeExe = (targetPath: string) => {
        message.info('正在启动工具，请稍等...');
        const workPath = resolve(cwd, '../tools/mhj');
        helper.runExe(join(workPath, 'mhj.exe'), [targetPath], workPath).catch((errMsg: string) => {
            console.log(errMsg);
            Modal.error({
                title: '启动失败',
                content: '启动失败，请联系技术支持',
                okText: '确定'
            });
        });

        dispatchModal({ type: 'miChangeModalVisible', payload: false });
    };

    /**
     * 运行华为手机克隆exe
     */
    const runHuaweiCloneExe = (targetPath: string) => {
        message.info('正在启动工具，请稍等...');
        const workPath = resolve(cwd, '../tools/mhj');
        helper.runExe(join(workPath, 'hwclone.exe'), [targetPath], workPath).catch((errMsg: string) => {
            console.log(errMsg);
            Modal.error({
                title: '启动失败',
                content: '启动失败，请联系技术支持',
                okText: '确定'
            });
        });
        dispatchModal({ type: 'huaweiCloneModalVisible', payload: false });
    };

    /**
     * 小米换机导入handle
     */
    const miChangeHandle = () => dispatchModal({ type: 'miChangeModalVisible', payload: true });

    /**
     * 华为手机克隆handle
     */
    const huaweiCloneHandle = () => dispatchModal({ type: 'huaweiCloneModalVisible', payload: true });

    /**
     * APK提取handle
     */
    const apkHandle = () => dispatchModal({ type: 'apkModalVisible', payload: true });

    return <SubLayout title="工具箱">
        <ToolBox>
            <SortBox>
                <div className="caption">导入第三方数据</div>
                <Split />
                <div className="t-row">
                    <div onClick={() => onImportClick(ImportTypes.IOS, '导入数据（苹果iTunes备份）')} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faItunes} color="#ed2139" />
                        </div>
                        <div className="name">
                            苹果iTunes备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.IOSMirror, '导入数据（苹果镜像）')} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faApple} />
                        </div>
                        <div className="name">
                            苹果镜像
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.Hisuite, '导入数据（华为备份）')} className="t-button">
                        <div className="ico">
                            <img src={huaweiSvg} height="50" />
                        </div>
                        <div className="name">
                            华为备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.HuaweiOTG, '导入数据（华为OTG备份）')} className="t-button">
                        <div className="ico">
                            <img src={huaweiSvg} width="50" height="50" />
                        </div>
                        <div className="name">
                            华为OTG备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.HuaweiClone, '导入数据（华为克隆备份）')} className="t-button">
                        <div className="ico">
                            <img src={hwcopyPng} width="50" height="50" />
                        </div>
                        <div className="name">
                            华为克隆备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.Hisuite, '导入数据（荣耀备份）')} className="t-button">
                        <div className="ico">
                            <img src={honorSvg} width="60" height="50" />
                        </div>
                        <div className="name">
                            荣耀备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.Hisuite, '导入数据（联通备份）')} className="t-button">
                        <div className="ico">
                            <img src={umagicSvg} height="50" />
                        </div>
                        <div className="name">
                            联通备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.VivoPcBackup, '导入数据（VIVO PC备份）')} className="t-button">
                        <div className="ico">
                            <img src={vivoSvg} height="50" />
                        </div>
                        <div className="name">
                            VIVO PC备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.OppoBackup, '导入数据（OPPO自备份）')} className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO自备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.XiaomiBackup, '导入数据（小米自备份）')} className="t-button">
                        <div className="ico">
                            <img src={miSvg} height="50" />
                        </div>
                        <div className="name">
                            小米自备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.XiaomiChange, '导入数据（小米换机备份）')} className="t-button">
                        <div className="ico">
                            <img src={miChangePng} height="50" />
                        </div>
                        <div className="name">
                            小米换机备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.Samsung_Smartswitch, '导入数据（三星换机）')} className="t-button">
                        <div className="ico">
                            <img src={samsungSmartswitch} height="50" />
                        </div>
                        <div className="name">
                            三星换机备份
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.AndroidData, '导入数据（安卓数据）')} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                        </div>
                        <div className="name">
                            安卓数据
                        </div>
                    </div>
                    <div onClick={() => onImportClick(ImportTypes.AndroidMirror, '导入数据（安卓物理镜像）')} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                        </div>
                        <div className="name">
                            安卓物理镜像
                        </div>
                    </div>
                    <Auth deny={!useFakeButton}>
                        <div onClick={() => onImportClick(ImportTypes.AndroidData, '导入数据（安卓镜像）')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                            </div>
                            <div className="name">
                                安卓镜像
                            </div>
                        </div>
                        <div onClick={() => onImportClick(ImportTypes.SDCardMirror, '导入数据（SD卡镜像）')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faSdCard} color="#07b6bf" />
                            </div>
                            <div className="name">
                                SD卡镜像
                            </div>
                        </div>
                    </Auth>
                </div>
            </SortBox>
            <ImportBak onClick={() => dispatchModal({ type: 'fakeImportModalVisible', payload: true })} />
            <SortBox>
                <div className="caption">应用锁破解</div>
                <Split />
                <div className="t-row">
                    <div
                        onClick={(event: MouseEvent<HTMLDivElement>) =>
                            crackLiClick(event, CrackTypes.VivoAppLock)
                        }
                        className="t-button">
                        <div className="ico">
                            <img src={vivoSvg} height="50" />
                        </div>
                        <div className="name">
                            VIVO应用锁
                        </div>
                    </div>
                    <div
                        onClick={(event: MouseEvent<HTMLDivElement>) =>
                            crackLiClick(event, CrackTypes.OppoAppLock)
                        }
                        className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO应用锁
                        </div>
                    </div>
                    <div
                        onClick={(event: MouseEvent<HTMLDivElement>) =>
                            crackLiClick(event, CrackTypes.OppoMoveLock)
                        }
                        className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO隐私锁
                        </div>
                    </div>
                </div>
            </SortBox>
            <Auth deny={!useFakeButton}>
                <SortBox>
                    <div className="caption">其他取证</div>
                    <Split />
                    <div className="t-row">
                        <div onClick={() => fakeFeaturePhoneModal('黑莓')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faBlackberry} />
                            </div>
                            <div className="name">
                                黑莓
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('塞班')} className="t-button">
                            <div className="ico">
                                <img src={symbianSvg} width="80" height="50" />
                            </div>
                            <div className="name">
                                塞班
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('WindowsMobile')} className="t-button">
                            <div className="ico">
                                <img src={windowsmobileSvg} height="50" />
                            </div>
                            <div className="name">
                                WindowsMobile
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('WindowsPhone')} className="t-button">
                            <div className="ico">
                                <img src={windowsphoneSvg} height="50" />
                            </div>
                            <div className="name">
                                WindowsPhone
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('MeeGo')} className="t-button">
                            <div className="ico">
                                <img src={meegoSvg} width="60" height="50" />
                            </div>
                            <div className="name">
                                MeeGo
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('badaOS')} className="t-button">
                            <div className="ico">
                                <img src={badaSvg} width="50" />
                            </div>
                            <div className="name">
                                badaOS
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('功能机/山寨机')} className="t-button">
                            <div className="ico">
                                <img src={featurephoneSvg} width="50" />
                            </div>
                            <div className="name">
                                功能机/山寨机
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('SIM卡')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faSimCard} color="#94c7a7" />
                            </div>
                            <div className="name">
                                SIM卡
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('SD卡')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faSdCard} color="#07b6bf" />
                            </div>
                            <div className="name">
                                SD卡
                            </div>
                        </div>
                        <div onClick={() => fakeFeaturePhoneModal('手机镜像')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faMobileRetro} />
                            </div>
                            <div className="name">
                                手机镜像
                            </div>
                        </div>
                    </div>
                </SortBox>
            </Auth>
            <SortBox>
                <div className="caption">其他功能</div>
                <Split />
                <div className="t-row">
                    <div onClick={() => dispatchModal({ type: 'alipayOrderModalVisible', payload: true })} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAlipay} color="#1477fe" />
                        </div>
                        <div className="name">
                            支付宝账单云取
                        </div>
                    </div>
                    {/* <div onClick={() => { }} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faWeixin} color="#51c332" />
                        </div>
                        <div className="name">
                            微信扫码
                        </div>
                    </div> */}
                    <div onClick={() => runExeHandle(ExeType.ChatDownload)} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faFileArrowDown} color="#CAD3C8" />
                        </div>
                        <div className="name">
                            数据导出工具
                        </div>
                    </div>
                    <div onClick={() => runExeHandle(ExeType.CallRecord)} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faSquarePhone} color="#706fd3" />
                        </div>
                        <div className="name">
                            通话记录导出工具
                        </div>
                    </div>
                    <Auth deny={!useFakeButton}>
                        <div onClick={() => runExeHandle(ExeType.HuaweiPassword)} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faUnlockKeyhole} color="#94c7a7" />
                            </div>
                            <div className="name">
                                华为开机密码破解
                            </div>
                        </div>
                        <div onClick={() => dispatchModal({ type: 'aiSimilarModalVisible', payload: true })} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faUsers} color="#fa983a" />
                            </div>
                            <div className="name">
                                AI相似人像查看
                            </div>
                        </div>
                    </Auth>
                    <div onClick={() => miChangeHandle()} className="t-button">
                        <div className="ico">
                            <img src={miChangePng} height={50} />
                        </div>
                        <div className="name">
                            小米换机采集
                        </div>
                    </div>
                    <div onClick={() => dispatchModal({ type: 'snapshotModalVisible', payload: true })} className="t-button">
                        <div className="ico" style={{ color: '#23a758' }}>
                            <FundViewOutlined />
                        </div>
                        <div className="name">
                            截屏获取
                        </div>
                    </div>
                    <div onClick={() => huaweiCloneHandle()} className="t-button">
                        <div className="ico">
                            <img src={hwcopyPng} height={50} />
                        </div>
                        <div className="name">
                            华为手机克隆
                        </div>
                    </div>
                    <div onClick={() => apkHandle()} className="t-button">
                        <div className="ico">
                            <img src={apkSvg} height={50} />
                        </div>
                        <div className="name">
                            安卓apk提取
                        </div>
                    </div>
                    <div onClick={() => {
                        currentSetType.current = SetType.PickAuth;
                        dispatchModal({ type: 'androidSetModalVisible', payload: true });
                    }} className="t-button">
                        <div className="ico">
                            <img src={androidAuthSvg} height={50} />
                        </div>
                        <div className="name">
                            安卓提权
                        </div>
                    </div>
                    <div onClick={() => {
                        currentSetType.current = SetType.Unlock;
                        dispatchModal({ type: 'androidSetModalVisible', payload: true });
                    }} className="t-button">
                        <div className="ico">
                            <UnlockOutlined style={{ color: '#a6ce3a' }} />
                        </div>
                        <div className="name">
                            安卓解锁
                        </div>
                    </div>
                    <div onClick={() => dispatchModal({ type: 'qrcodeCloudModalVisible', payload: true })} className="t-button">
                        <div className="ico">
                            <img src={ccbSvg} height={50} />
                        </div>
                        <div className="name">
                            建设银行云取
                        </div>
                    </div>
                    <div onClick={() => dispatchModal({ type: 'chinaMobileModalVisible', payload: true })} className="t-button">
                        <div className="ico">
                            <img src={chinaMobileSvg} height={50} />
                        </div>
                        <div className="name">
                            中国移动云取
                        </div>
                    </div>
                    <div onClick={() => shell.openExternal('http://58.48.76.202:12086/')} className="t-button">
                        <div className="ico">
                            <img src={cloudSearchSvg} height={50} />
                        </div>
                        <div className="name">App云取探测</div>
                    </div>
                    <div onClick={() => shell.openExternal('http://58.48.76.202:16688/')} className="t-button">
                        <div className="ico">
                            <img src={userSearchSvg} height={50} />
                        </div>
                        <div className="name">虚拟身份探测</div>
                    </div>
                </div>
            </SortBox>
        </ToolBox>
        <ImportDataModal />
        <AlipayOrderModal
            visible={modalState.alipayOrderModalVisible}
            cancelHandle={alipayOrderModalCancelHandle}
            saveHandle={alipayOrderModalSaveHandle} />
        <AiSimilarModal
            visible={modalState.aiSimilarModalVisible}
            closeHandle={() => dispatchModal({ type: 'aiSimilarModalVisible', payload: false })} />
        <ApkModal
            visible={modalState.apkModalVisible}
            cancelHandle={() => dispatchModal({ type: 'apkModalVisible', payload: false })} />
        <CrackModal
            visible={modalState.crackModalVisible}
            type={currentCrackType.current}
            cancelHandle={() => dispatchModal({ type: 'crackModalVisible', payload: false })} />
        <MiChangeModal
            visible={modalState.miChangeModalVisible}
            onOk={runMiChangeExe}
            onCancel={() => dispatchModal({ type: 'miChangeModalVisible', payload: false })} />
        <HuaweiCloneModal
            visible={modalState.huaweiCloneModalVisible}
            onOk={runHuaweiCloneExe}
            onCancel={() => dispatchModal({ type: 'huaweiCloneModalVisible', payload: false })} />
        <FakeImportModal
            visible={modalState.fakeImportModalVisible}
            onCloseClick={() => dispatchModal({ type: 'fakeImportModalVisible', payload: false })} />
        <SnapshotModal
            visible={modalState.snapshotModalVisible}
            cancelHandle={() => dispatchModal({ type: 'snapshotModalVisible', payload: false })} />
        <QrcodeCloudModal
            visible={modalState.qrcodeCloudModalVisible}
            onCancel={() => dispatchModal({ type: 'qrcodeCloudModalVisible', payload: false })} />
        <ChinaMobileModal
            visible={modalState.chinaMobileModalVisible}
            onCancel={() => dispatchModal({ type: 'chinaMobileModalVisible', payload: false })} />
        <AndroidSetModal
            visible={modalState.androidSetModalVisible}
            type={currentSetType.current}
            onCancel={() => dispatchModal({ type: 'androidSetModalVisible', payload: false })} />
    </SubLayout >
};

export default Tool;