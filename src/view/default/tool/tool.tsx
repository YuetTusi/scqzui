import { join, resolve } from 'path';
import React, { FC, useState, useCallback, useRef, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Popover from 'antd/lib/popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSquarePhone, faFileArrowDown, faUnlockKeyhole, faUsers, faFolder, faFileZipper
} from '@fortawesome/free-solid-svg-icons';
import {
    faApple, faAndroid, faItunes, faBlackberry, faAlipay
} from '@fortawesome/free-brands-svg-icons';
import Auth from '@/component/auth';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import AlipayOrderModal from './alipay-order-modal';
import ImportDataModal from './import-data-modal';
import CrackModal from './crack-modal';
import { AiSimilarModal, fakeModal, FakeImportModal } from './fake-modal';
import MiChangeModal from './mi-change-modal';
import ButtonDesc from './button-desc';
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
import signalSvg from './styled/images/signal.svg';
import { CrackTypes } from './crack-modal/prop';
import { ExeType, ToolProp } from './prop';

const cwd = process.cwd();
const { useFakeButton } = helper.readConf()!;

/**
 * 工具箱
 */
const Tool: FC<ToolProp> = () => {

    const dispatch = useDispatch();
    const currentCrackType = useRef(CrackTypes.VivoAppLock);
    const [alipayOrderModalVisible, setAlipayOrderModalVisible] = useState<boolean>(false);
    const [aiSimilarModalVisible, setAiSimilarModalVisible] = useState<boolean>(false);
    const [crackModalVisible, setCrackModalVisible] = useState<boolean>(false);
    const [miChangeModalVisible, setMiChangeModalVisible] = useState<boolean>(false);
    const [fakeImportModalVisible, setFakeImportModalVisible] = useState<boolean>(false);

    /**
     * 支付宝云取取消handle
     */
    const alipayOrderModalCancelHandle = useCallback(() => {
        setAlipayOrderModalVisible(false);
    }, [alipayOrderModalVisible]);

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
        setAlipayOrderModalVisible(false);
    }, [alipayOrderModalVisible]);

    /**
     * 应用锁破解按钮Click
     * @param event 事件对象
     * @param type 破解类型
     */
    const crackLiClick = (event: MouseEvent<HTMLDivElement>, type: CrackTypes) => {
        currentCrackType.current = type;
        setCrackModalVisible(true);
    };

    /**
     * 导入按钮click
     * @param type 类型
     * @param title 标题
     */
    const onImportClick = (type: ImportTypes, title: string) => {
        dispatch({ type: 'importDataModal/setTitle', payload: title });
        dispatch({ type: 'importDataModal/setImportType', payload: type });
        dispatch({ type: 'importDataModal/setVisible', payload: true });
    };

    /**
     * 运行exe
     */
    const runExeHandle = (type: ExeType) => {
        let exePath: string | null = null;
        const hide = message.loading('正在启动工具，请稍等...', 0);
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
                .then(() => {
                    hide();
                })
                .catch((errMsg: string) => {
                    console.log(errMsg);
                    hide();
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
            message.destroy();
            Modal.error({
                title: '启动失败',
                content: '启动失败，请联系技术支持',
                okText: '确定'
            });
        });
        setMiChangeModalVisible(false);
    };

    /**
     * 小米换机导入handle
     */
    const miChangeHandle = () => setMiChangeModalVisible(true);

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
                    <div onClick={() => onImportClick(ImportTypes.AndroidData, '导入数据（安卓数据）')} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                        </div>
                        <div className="name">
                            安卓数据
                        </div>
                    </div>
                </div>
            </SortBox>
            <Auth deny={!useFakeButton}>
                <SortBox>
                    <div className="caption">导入苹果检材</div>
                    <Split />
                    <div className="t-row">
                        <Popover
                            title="苹果文件夹"
                            placement="topRight"
                            content={<ButtonDesc>
                                <ul>
                                    <li>描述：包含从苹果手机提取的任何形式的文件夹，（比如从苹果手机上提取的包含微信数据的文件夹）</li>
                                    <li>导入方式：路径选择到具体苹果应用文件夹的上一层目录</li>
                                </ul>
                                <em>（如需解析 com.tencent.xin 文件夹，路径选择到 com.tencent.xin 的上一层目录）</em>
                            </ButtonDesc>}>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    苹果文件夹
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="iTunes备份"
                            placement="topRight"
                            content={<ButtonDesc>
                                <ul>
                                    <li>描述：通过 iTunes 备份对苹果手机进行备份产生的文件夹</li>
                                    <li>导入方式：路径选择到 backup 下一层目录，该文件夹默认路径为 C:\Users\[账户名]\AppData\Roaming\Apple Computer\MobileSync\Backup\目录</li>
                                </ul>
                            </ButtonDesc>}>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    iTunes备份
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="苹果tar文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：取证软件对苹果手机文件系统提取的 tar 包</li>
                                        <li>导入方式：路径选择到 tar 文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#11c111" />
                                </div>
                                <div className="name">
                                    苹果tar文件
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="苹果zip文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：苹果手机提取的任意文件夹进行不带压缩率制作的 zip 包</li>
                                        <li>导入方式：路径选择到 zip 文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#80b4fb" />
                                </div>
                                <div className="name">
                                    苹果zip文件
                                </div>
                            </div>
                        </Popover>
                    </div>
                </SortBox>
                <SortBox>
                    <div className="caption">导入安卓检材</div>
                    <Split />
                    <div className="t-row">
                        <Popover
                            title="安卓物理镜像(dd)"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持 bin，e01，tar，extx，gpt，exfat，fat，vmdk，ntsf，f2fs，zip 格式的物理镜像，文件后缀名体现为*.dd，*.img 等</li>
                                        <li>导入方式：路径选择到 zip 文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                                </div>
                                <div className="name">
                                    安卓物理镜像(dd)
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="YunOS备份(目录)"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：阿里 YunOS 手机操作系统备份出的文件，包含以*.backup, *.backup1, *.backup*命名的文件夹</li>
                                        <li>导入方式：路径选择到*.backup, *.backup1, *.backup*命名的文件夹</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    YunOS备份(目录)
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="小米自备份"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：小米手机内置备份 App 产生的备份文件</li>
                                        <li>导入方式：路径选择到自备份文件的时间戳目录（如:\20200324_150327）</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    小米自备份
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="VIVO自备份"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持 vivo 互传文件的解析</li>
                                        <li>导入方式：路径选择到时间戳目录（如：\vivoX23\18601759531-1575426505445）</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    VIVO自备份
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="OPPO自备份"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：OPPO 手机内置的备份 APP 产生的备份文件，通常以文件夹的形式存放的</li>
                                        <li>导入方式：路径选择到自备份文件的 Backup 目录（如：\Backup）</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    OPPO自备份
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="魅族自备份(目录)"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：魅族手机内置的备份 APP 产生的备份文件夹</li>
                                        <li>导入方式：路径选择到检材目录下的时间戳命名的文件夹</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    魅族自备份(目录)
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="魅族自备份(zip)"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：魅族手机内置的备份 APP 产生的备份 zip 包</li>
                                        <li>导入方式：路径选择到检材目录下的时间戳命名的 zip 包</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#80b4fb" />
                                </div>
                                <div className="name">
                                    魅族自备份(zip)
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="ADB备份文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：通过 ADB 命令，对安卓手机进行备份生成的备份包。此为安卓手机通用的备份格式，几乎支持所有安卓手机</li>
                                        <li>导入方式：路径选择到.ab 文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#11c111" />
                                </div>
                                <div className="name">
                                    ADB备份文件
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="安卓文件夹"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持从安卓手机提取的任何文件的文件夹，如从安卓手机提取的包含微信数据的文件夹</li>
                                        <li>导入方式：选择安卓文件夹，路径选择到具体安卓应用文件夹的上一层目录</li>
                                    </ul>
                                    <em>（如需解析 com.tencent.mm 文件夹，路径选择到 com.tencent.mm 的上一层目录）</em>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    安卓文件夹
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="华为备份文件夹"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持从安卓手机提取的任何文件夹，如从安卓手机提取的包含微信数据的文件夹</li>
                                        <li>导入方式：选择安卓文件夹，路径选择到具体安卓应用文件夹的上一层目录</li>
                                    </ul>
                                    <em>（如需解析 com.tencent.mm 文件夹，路径选择到 com.tencent.mm 的上一层目录）</em>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                                </div>
                                <div className="name">
                                    华为备份文件夹
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="Signal备份文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：利用 signal 软件自身的备份</li>
                                        <li>导入方式：路径选择时间戳目录</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <img src={signalSvg} alt="signal" width={60} height={60} />
                                </div>
                                <div className="name">
                                    Signal备份文件
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="Signal备份文件(zip)"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：利用 signal 软件自身的备份</li>
                                        <li>导入方式：路径选择到时间戳目录</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#80b4fb" />
                                </div>
                                <div className="name">
                                    Signal备份文件(zip)
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="安卓tar文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持安卓手机全盘提取的 tar 包，或者是第三方取证软件对安卓手机文件系统提取的 tar 包</li>
                                        <li>导入方式：选择到 tar 包文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#11c111" />
                                </div>
                                <div className="name">
                                    安卓tar文件
                                </div>
                            </div>
                        </Popover>
                        <Popover
                            title="安卓zip文件"
                            placement="topRight"
                            content={
                                <ButtonDesc>
                                    <ul>
                                        <li>描述：支持安卓手机全盘提取的 zip 包，或者是第三方取证软件安卓手机文件系统提取的 zip 包</li>
                                        <li>导入方式：选择到 zip 包文件</li>
                                    </ul>
                                </ButtonDesc>
                            }>
                            <div className="t-button" onClick={() => setFakeImportModalVisible(true)}>
                                <div className="ico">
                                    <FontAwesomeIcon icon={faFileZipper} color="#80b4fb" />
                                </div>
                                <div className="name">
                                    安卓zip文件
                                </div>
                            </div>
                        </Popover>
                    </div>
                </SortBox>
            </Auth>
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
                    <div className="caption">其他品牌取证</div>
                    <Split />
                    <div className="t-row">
                        <div onClick={() => fakeModal('黑莓')} className="t-button">
                            <div className="ico">
                                <FontAwesomeIcon icon={faBlackberry} />
                            </div>
                            <div className="name">
                                黑莓
                            </div>
                        </div>
                        <div onClick={() => fakeModal('塞班')} className="t-button">
                            <div className="ico">
                                <img src={symbianSvg} width="80" height="50" />
                            </div>
                            <div className="name">
                                塞班
                            </div>
                        </div>
                        <div onClick={() => fakeModal('WindowsMobile')} className="t-button">
                            <div className="ico">
                                <img src={windowsmobileSvg} height="50" />
                            </div>
                            <div className="name">
                                WindowsMobile
                            </div>
                        </div>
                        <div onClick={() => fakeModal('WindowsPhone')} className="t-button">
                            <div className="ico">
                                <img src={windowsphoneSvg} height="50" />
                            </div>
                            <div className="name">
                                WindowsPhone
                            </div>
                        </div>
                        <div onClick={() => fakeModal('MeeGo')} className="t-button">
                            <div className="ico">
                                <img src={meegoSvg} width="60" height="50" />
                            </div>
                            <div className="name">
                                MeeGo
                            </div>
                        </div>
                        <div onClick={() => fakeModal('badaOS')} className="t-button">
                            <div className="ico">
                                <img src={badaSvg} width="50" />
                            </div>
                            <div className="name">
                                badaOS
                            </div>
                        </div>
                        <div onClick={() => fakeModal('功能机/山寨机')} className="t-button">
                            <div className="ico">
                                <img src={featurephoneSvg} width="50" />
                            </div>
                            <div className="name">
                                功能机/山寨机
                            </div>
                        </div>
                    </div>
                </SortBox>
            </Auth>
            <SortBox>
                <div className="caption">其他功能</div>
                <Split />
                <div className="t-row">
                    <div onClick={() => setAlipayOrderModalVisible(true)} className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAlipay} color="#1477fe" />
                        </div>
                        <div className="name">
                            支付宝账单云取
                        </div>
                    </div>
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
                        <div onClick={() => setAiSimilarModalVisible(true)} className="t-button">
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
                </div>
            </SortBox>
        </ToolBox>
        <ImportDataModal />
        <AlipayOrderModal
            visible={alipayOrderModalVisible}
            cancelHandle={alipayOrderModalCancelHandle}
            saveHandle={alipayOrderModalSaveHandle} />
        <AiSimilarModal
            visible={aiSimilarModalVisible}
            closeHandle={() => setAiSimilarModalVisible(false)} />
        <CrackModal
            visible={crackModalVisible}
            type={currentCrackType.current}
            cancelHandle={() => setCrackModalVisible(false)} />
        <MiChangeModal
            visible={miChangeModalVisible}
            onOk={runMiChangeExe}
            onCancel={() => setMiChangeModalVisible(false)}
        />
        <FakeImportModal
            visible={fakeImportModalVisible}
            onCloseClick={() => setFakeImportModalVisible(false)} />
    </SubLayout>
};

export default Tool;