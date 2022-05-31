import { join } from 'path';
import React, { FC, useState, useCallback, useRef, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import message from 'antd/lib/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSquarePhone, faFileArrowDown, faUnlockKeyhole, faUsers
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
import { AiSimilarModal, fakeModal } from './fake-modal';
import { SortBox, ToolBox } from './styled/style';
import { ImportTypes } from '@/schema/import-type';
import huaweiSvg from './styled/images/huawei.svg';
import honorSvg from './styled/images/honor.svg';
import umagicSvg from './styled/images/umagic.svg';
import oppoSvg from './styled/images/oppo.svg';
import vivoSvg from './styled/images/vivo.svg';
import miSvg from './styled/images/mi.svg';
import symbianSvg from './styled/images/symbian.svg';
import windowsmobileSvg from './styled/images/windowsmobile.svg';
import windowsphoneSvg from './styled/images/windowsphone.svg';
import badaSvg from './styled/images/bada.svg';
import featurephoneSvg from './styled/images/featurephone.svg';
import meegoSvg from './styled/images/meego.svg';
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
    </SubLayout>
};

export default Tool;