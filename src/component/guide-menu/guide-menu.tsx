import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMobileScreenButton,
    faScrewdriverWrench,
    faFileLines,
    faGears,
    faBrain,
    faUserPen
} from '@fortawesome/free-solid-svg-icons';
import { MenuPanel } from './styled/menu-panel';
import ColorButton from './color-button';
import ImageButton from './image-button';
import { GuideMenuProp } from './prop';
import envidence from './image/3.jpg';
import tool from './image/2.jpg';

/**
 * 主屏菜单
 */
const GuideMenu: FC<GuideMenuProp> = () => {

    return <MenuPanel>
        <div className="evidence">
            <ImageButton
                to="/collect"
                icon={<FontAwesomeIcon icon={faMobileScreenButton} />}
                src={envidence}
                description={<ul>
                    <li>1秒极速提取N部设备</li>
                    <li>还没来得及插入USB，数据已提取</li>
                    <li>快来成为快如闪电般的男人</li>
                </ul>}>
                设备取证
            </ImageButton>
        </div>
        <div className="case">
            <ColorButton
                to="/settings"
                icon={<FontAwesomeIcon icon={faFileLines} />}
                color="#1B9CFC">
                案件管理
            </ColorButton>
        </div>
        <div className="parse">
            <ColorButton
                to="/settings"
                icon={<FontAwesomeIcon icon={faBrain} />}
                color="#FD7272">
                数据解析
            </ColorButton>
        </div>
        <div className="tool">
            <ImageButton
                to="/settings"
                icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
                src={tool}
                description={<ul>
                    <li>大佬提供的多种方便工具</li>
                </ul>}>
                工具箱
            </ImageButton>
        </div>
        <div className="log">
            <ColorButton
                to=""
                icon={<FontAwesomeIcon icon={faUserPen} />}
                color="#58B19F">
                操作日志
            </ColorButton>
        </div>
        <div className="setting">
            <ColorButton
                to="/settings"
                icon={<FontAwesomeIcon icon={faGears} />}
                color="#82589F">
                软件设置
            </ColorButton>
        </div>
    </MenuPanel>;
};

export default GuideMenu;