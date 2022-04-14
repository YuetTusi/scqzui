import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePhone, faFileArrowDown, faLockOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faApple, faAndroid, faItunes, faBlackberry, faAlipay } from '@fortawesome/free-brands-svg-icons';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { SortBox, ToolBox } from './styled/style';
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

/**
 * 工具箱
 */
const Tool: FC<{}> = ({ }) => {

    return <SubLayout title="工具箱">
        <ToolBox>
            <SortBox>
                <div className="caption">导入第三方数据</div>
                <Split />
                <div className="t-row">
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faItunes} color="#ed2139" />
                        </div>
                        <div className="name">
                            苹果iTunes备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faApple} />
                        </div>
                        <div className="name">
                            苹果镜像导入
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={huaweiSvg} height="50" />
                        </div>
                        <div className="name">
                            华为备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={huaweiSvg} width="50" height="50" />
                        </div>
                        <div className="name">
                            华为OTG备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={honorSvg} width="60" height="50" />
                        </div>
                        <div className="name">
                            荣耀备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={umagicSvg} height="50" />
                        </div>
                        <div className="name">
                            联通备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={vivoSvg} height="50" />
                        </div>
                        <div className="name">
                            VIVO PC备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO自备份
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={miSvg} height="50" />
                        </div>
                        <div className="name">
                            小米自备份
                        </div>
                    </div>
                    <div className="t-button">
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
                    <div className="t-button">
                        <div className="ico">
                            <img src={vivoSvg} height="50" />
                        </div>
                        <div className="name">
                            VIVO应用锁
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO应用锁
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={oppoSvg} height="50" />
                        </div>
                        <div className="name">
                            OPPO隐私锁
                        </div>
                    </div>
                </div>
            </SortBox>
            <SortBox>
                <div className="caption">其他品牌取证</div>
                <Split />
                <div className="t-row">
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faBlackberry} />
                        </div>
                        <div className="name">
                            黑莓
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={symbianSvg} width="80" height="50" />
                        </div>
                        <div className="name">
                            塞班
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={windowsmobileSvg} height="50" />
                        </div>
                        <div className="name">
                            WindowsMobile
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={windowsphoneSvg} height="50" />
                        </div>
                        <div className="name">
                            WindowsPhone
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={badaSvg} width="50" />
                        </div>
                        <div className="name">
                            badaOS
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={meegoSvg} width="60" height="50" />
                        </div>
                        <div className="name">
                            MeeGo
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <img src={featurephoneSvg} width="50" />
                        </div>
                        <div className="name">
                            功能机/山寨机
                        </div>
                    </div>
                </div>
            </SortBox>
            <SortBox>
                <div className="caption">其他功能</div>
                <Split />
                <div className="t-row">
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faAlipay} color="#1477fe" />
                        </div>
                        <div className="name">
                            支付宝账单云取
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faFileArrowDown} color="#a4b0be" />
                        </div>
                        <div className="name">
                            数据导出工具
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faSquarePhone} color="#706fd3" />
                        </div>
                        <div className="name">
                            通话记录导出工具
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faLockOpen} color="#218c74" />
                        </div>
                        <div className="name">
                            华为开机密码破解
                        </div>
                    </div>
                    <div className="t-button">
                        <div className="ico">
                            <FontAwesomeIcon icon={faUsers} color="#CAD3C8" />
                        </div>
                        <div className="name">
                            AI相似人像查看
                        </div>
                    </div>
                </div>
            </SortBox>
        </ToolBox>
    </SubLayout>
};

export default Tool;