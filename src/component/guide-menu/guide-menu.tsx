import React, { FC, MouseEvent } from 'react';
import Modal from 'antd/lib/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRegistered,
    faFileLines,
    faGears,
    faBolt,
    faUserPen,
    faFileWaveform
} from '@fortawesome/free-solid-svg-icons';
import Auth from '@/component/auth';
import Manufaturer from '@/schema/manufaturer';
import { helper } from '@/utils/helper';
import { MenuPanel, VersionBox } from './styled/menu-panel';
import ColorButton from './color-button';
import ImageButton from './image-button';
import { GuideMenuProp } from './prop';
import envidence from './image/3.jpg';
import tool from './image/2.jpg';
import { useManufacturer } from '@/hook';

const {
    useBcp,
    useToolBox,
    useQuickFetch,
    caseText,
    devText,
    fetchText,
    parseText
} = helper.readConf()!;

/**
 * 权限首列占位
 */
const renderFirstBox = () => {
    if (useQuickFetch) {
        return <div>
            <ColorButton
                to="/quick"
                icon={<FontAwesomeIcon icon={faBolt} />}
                color="#e1b12c">
                快速点验
            </ColorButton>
        </div>;
    } else {
        //如果没开启`快速点验功能`使用数据解析占位
        return <div className="parse">
            <ColorButton
                to="/parse"
                icon={<FontAwesomeIcon icon={faFileWaveform} />}
                color="#FD7272">
                {`数据${parseText ?? '解析'}`}
            </ColorButton>
        </div>
    }
}

/**
 * 权限末列占位
 */
const renderLastBox = (manu: Manufaturer | null) => {
    let dom: JSX.Element[] = [];
    if (useQuickFetch) {
        //如果开启了`快速点验`，需要在这里渲染数据解析按钮
        dom = dom.concat([<div className="parse" key="GM_0">
            <ColorButton
                to="/parse"
                icon={<FontAwesomeIcon icon={faFileWaveform} />}
                color="#FD7272">
                {`数据${parseText ?? '解析'}`}
            </ColorButton>
        </div>]);
    }
    dom = dom.concat([
        <div className="log" key="GM_1">
            <ColorButton
                to="/log"
                icon={<FontAwesomeIcon icon={faUserPen} />}
                color="#3c6382">
                操作日志
            </ColorButton>
        </div>,
        <div className="setting" key="GM_2">
            <ColorButton
                to={useBcp ? '/settings' : '/settings/self-unit'}
                icon={<FontAwesomeIcon icon={faGears} />}
                color="#82589F">
                软件设置
            </ColorButton>
        </div>
    ]);
    if (dom.length % 2 !== 0) {
        dom = dom.concat([
            <div className="version" key="GM_3">
                <ColorButton
                    to={(event: MouseEvent<HTMLElement>) => {
                        event.preventDefault();
                        Modal.info({
                            content: <VersionBox>
                                <p>
                                    <label>产品名称</label>
                                    <span>{manu?.materials_name ?? ''}</span>
                                </p>
                                <p>
                                    <label>开发方</label>
                                    <span>{manu?.manufacturer ?? ''}</span>
                                </p>
                                <p>
                                    <label>序列号</label>
                                    <span>{manu?.materials_serial ?? ''}</span>
                                </p>
                                <p>
                                    <label>当前版本</label>
                                    <span>{manu?.materials_software_version ?? ''}</span>
                                </p>
                            </VersionBox>,
                            centered: true,
                            title: '版本信息',
                            okText: '确定'
                        });
                    }}
                    icon={<FontAwesomeIcon icon={faRegistered} />}
                    color="#15a085">
                    版本信息
                </ColorButton>
            </div>
        ]);
    }

    return dom;
}

/**
 * 主屏菜单
 */
const GuideMenu: FC<GuideMenuProp> = () => {

    const manu = useManufacturer();

    return <MenuPanel>
        <div className="case">
            <ColorButton
                to="/case-data"
                icon={<FontAwesomeIcon icon={faFileLines} />}
                color="#1B9CFC">
                {`${caseText ?? '案件'}管理`}
            </ColorButton>
        </div>
        {renderFirstBox()}
        <div className="evidence">
            <ImageButton
                to="/collect"
                src={envidence}
                description={<ul>
                    <li>1秒极速提取N部设备</li>
                    <li>还没来得及插入USB，数据已提取</li>
                    <li>快来成为快如闪电般的男人</li>
                </ul>}>
                {`${devText ?? '设备'}${fetchText ?? '取证'}`}
            </ImageButton>
        </div>
        <Auth deny={!useToolBox}>
            <div className="tool">
                <ImageButton
                    to="/tool"
                    src={tool}
                    description={<ul>
                        <li>大佬提供的多种方便工具</li>
                    </ul>}>
                    工具箱
                </ImageButton>
            </div>
        </Auth>
        {renderLastBox(manu)}
    </MenuPanel>;
};

export default GuideMenu;