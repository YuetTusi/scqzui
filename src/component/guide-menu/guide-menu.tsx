import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMobileScreenButton,
    faScrewdriverWrench,
    faFileLines,
    faGears,
    faBolt,
    faUserPen,
    faFileWaveform
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
        <div className="case">
            <ColorButton
                to="/case-data"
                icon={<FontAwesomeIcon icon={faFileLines} />}
                color="#1B9CFC">
                案件管理
            </ColorButton>
        </div>
        <div>
            <ColorButton
                to="/quick"
                icon={<FontAwesomeIcon icon={faBolt} />}
                color="#EAB543">
                快速点验
            </ColorButton>
        </div>

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
        <div className="tool">
            <ImageButton
                to="/tool"
                icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
                src={tool}
                description={<ul>
                    <li>大佬提供的多种方便工具</li>
                </ul>}>
                工具箱
            </ImageButton>
        </div>
        <div className="parse">
            <ColorButton
                to="/parse"
                icon={<FontAwesomeIcon icon={faFileWaveform} />}
                color="#FD7272">
                数据解析
            </ColorButton>
        </div>
        <div className="log">
            <ColorButton
                to="/log"
                icon={<FontAwesomeIcon icon={faUserPen} />}
                color="#3c6382">
                操作日志
            </ColorButton>
        </div>
        {/* <div>
            <ColorButton
                to="/tool"
                icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
                color="#3dc1d3">
                工具箱
            </ColorButton>
        </div> */}
        <div className="setting">
            <ColorButton
                to="/settings"
                icon={<FontAwesomeIcon icon={faGears} />}
                color="#82589F">
                软件设置
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