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
import envidence from './image/1.jpg';
import tool from './image/2.jpg';
import { useAppSerial, useManufacturer } from '@/hook';

const {
    useFetch,
    useServerCloud,
    useBcp,
    useToolBox,
    useQuickFetch,
    caseText,
    devText,
    fetchText,
    parseText
} = helper.readConf()!;

/**
 * 渲染色块按钮
 * @param {Manufaturer|null} manufaturer.json
 * @param {string} serial 软件序列号
 */
const renderColorButtons = (manu: Manufaturer | null, serial: string) => {
    let buttons: JSX.Element[] = [];
    if (useFetch || useServerCloud) {
        buttons = buttons.concat([
            <div className="case" key="CaseData">
                <ColorButton
                    to="/case-data"
                    icon={<FontAwesomeIcon icon={faFileLines} />}
                    color="#1B9CFC">
                    {`${caseText ?? '案件'}管理`}
                </ColorButton>
            </div>
        ]);
    }
    if (useQuickFetch) {
        buttons = buttons.concat([
            <div key="Quick">
                <ColorButton
                    to="/quick"
                    icon={<FontAwesomeIcon icon={faBolt} />}
                    description={
                        <ul>
                            <li>手机连接WiFi，通过扫码方式采集</li>
                            <li>仅采集短信、电话本</li>
                            <li>通话记录、系统日志</li>
                            <li>应用安装列表等信息</li>
                        </ul>
                    }
                    color="#e1b12c">
                    快速{fetchText ?? '点验'}
                </ColorButton>
            </div>
        ]);
    }
    if (useFetch || useServerCloud) {
        buttons = buttons.concat([
            <div className="parse" key="Parse">
                <ColorButton
                    to="/parse"
                    icon={<FontAwesomeIcon icon={faFileWaveform} />}
                    color="#FD7272">
                    {`数据${parseText ?? '解析'}`}
                </ColorButton>
            </div>
        ]);
    }
    buttons = buttons.concat([
        <div className="log" key="Log">
            <ColorButton
                to={!useFetch && !useServerCloud ? '/log/parse-log' : '/log'}
                icon={<FontAwesomeIcon icon={faUserPen} />}
                color="#22a6b3">
                操作日志
            </ColorButton>
        </div>,
        <div className="setting" key="Settings">
            <ColorButton
                to={useBcp ? '/settings' : '/settings/self-unit'}
                icon={<FontAwesomeIcon icon={faGears} />}
                color="#82589F">
                软件设置
            </ColorButton>
        </div>
    ]);
    if (buttons.length % 2 !== 0) {
        buttons = buttons.concat([
            <div className="version" key="Version">
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
                                    <span>{serial}</span>
                                </p>
                                <p>
                                    <label>当前版本</label>
                                    <span>{(manu?.materials_software_version ?? '').replace(/-/g, '.')}</span>
                                </p>
                            </VersionBox>,
                            centered: true,
                            width: 500,
                            title: '版本信息',
                            okText: '确定'
                        });
                    }}
                    icon={<FontAwesomeIcon icon={faRegistered} />}
                    color="#4b6584">
                    版本信息
                </ColorButton>
            </div>
        ]);
    }
    return buttons;
};

/**
 * 主屏菜单
 */
const GuideMenu: FC<GuideMenuProp> = () => {

    const serial = useAppSerial();
    const manu = useManufacturer();
    const buttons = renderColorButtons(manu, serial);

    return <MenuPanel>
        {buttons.slice(0, 2)}
        <Auth deny={!useFetch && !useServerCloud}>
            <div className="evidence">
                <ImageButton
                    to="/collect"
                    src={envidence}
                    description={<ul>
                        <li>通过连接USB或WiFi方式</li>
                        <li>实现多路全数据快速采集</li>
                        <li>N路同时解析</li>
                        <li>数据深度恢复</li>
                    </ul>}>
                    {`${devText ?? '设备'}${fetchText ?? '取证'}`}
                </ImageButton>
            </div>
        </Auth>
        <Auth deny={!useToolBox}>
            <div className="tool">
                <ImageButton
                    to="/tool"
                    src={tool}
                    description={<ul>
                        <li>加载第三方备份/镜像文件解析</li>
                        <li>支付宝账单扫码</li>
                        <li>云取、应用锁破解等多款工具</li>
                    </ul>}>
                    工具箱
                </ImageButton>
            </div>
        </Auth>
        {buttons.slice(2)}
        <div className="last"></div>
    </MenuPanel>;
};

export default GuideMenu;