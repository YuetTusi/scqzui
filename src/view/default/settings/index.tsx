import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding, faRegistered, faBuildingColumns, faUser,
    faLightbulb, faPenToSquare, faKey, faFileArrowUp, faUserGear
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, Route } from 'dva/router';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import Reading from '@/component/loading/reading';
import AlartMessage from '@/component/alert-message';
import Unit from '@/view/default/settings/unit';
import DstUnit from '@/view/default/settings/dst-unit';
import SelfUnit from '@/view/default/settings/self-unit';
import Officer from '@/view/default/settings/officer';
import OfficerEdit from '@/view/default/settings/officer/edit';
import Keywords from '@/view/default/settings/keywords';
import CheckManage from '@/view/default/settings/check-manage';
import TraceLogin from '@/view/default/settings/trace-login';
import Ftp from '@/view/default/settings/ftp';
import LoginConfig from '@/view/default/settings/login-config';
import Version from '@/view/default/settings/version';
import { MenuPanel } from './styled/menu';
import { SettingLayout } from './styled/sub-layout';
import ContentBox from './content-box';

const { useBcp, useLogin, useTraceLogin, fetchText } = helper.readConf()!;

/**
 * 设置布局页
 */
const Index: FC<{}> = () => <SettingLayout>
    <Reading />
    <AlartMessage />
    <MenuPanel>
        <div className="sub-title">
            软件设置
        </div>
        <ul>
            <Auth deny={!useBcp}>
                <li>
                    <NavLink to="/settings" exact={true} replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faBuilding} /></span>
                            <span className="name">采集单位</span>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings/dst-unit" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faBuildingColumns} /></span>
                            <span className="name">目的检验单位</span>
                        </div>
                    </NavLink>
                </li>
            </Auth>
            <Auth deny={useBcp}>
                <li>
                    <NavLink to="/settings/self-unit" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faBuilding} /></span>
                            <span className="name">采集单位管理</span>
                        </div>
                    </NavLink>
                </li>
            </Auth>
            <li>
                <NavLink to="/settings/officer" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faUser} /></span>
                        <span className="name">{`${fetchText ?? '取证'}人员信息`}</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings/keywords" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faLightbulb} /></span>
                        <span className="name">关键词配置</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings/check-manage" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faPenToSquare} /></span>
                        <span className="name">点验记录管理</span>
                    </div>
                </NavLink>
            </li>
            <Auth deny={!useTraceLogin}>
                <li>
                    <NavLink to="/settings/trace-login" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faKey} /></span>
                            <span className="name">云点验登录</span>
                        </div>
                    </NavLink>
                </li>
            </Auth>
            <Auth deny={!useBcp}>
                <li>
                    <NavLink to="/settings/ftp" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faFileArrowUp} /></span>
                            <span className="name">BCP文件上传配置</span>
                        </div>
                    </NavLink>
                </li>
            </Auth>
            <Auth deny={!useLogin}>
                <li>
                    <NavLink to="/settings/login-config" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faUserGear} /></span>
                            <span className="name">登录验证配置</span>
                        </div>
                    </NavLink>
                </li>
            </Auth>
            <li>
                <NavLink to="/settings/version" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faRegistered} /></span>
                        <span className="name">软件版本</span>
                    </div>
                </NavLink>
            </li>
        </ul>
    </MenuPanel>
    <Route
        path="/settings"
        exact={true}
        component={() => <ContentBox title="采集单位"><Unit /></ContentBox>} />
    <Route
        path="/settings/unit"
        component={() => <ContentBox title="采集单位"><Unit /></ContentBox>} />
    <Route
        path="/settings/dst-unit"
        component={() => <ContentBox title="目的检验单位"><DstUnit /></ContentBox>} />
    <Route
        path="/settings/self-unit"
        component={() => <ContentBox title="采集单位管理"><SelfUnit /></ContentBox>} />
    <Route
        path="/settings/officer"
        exact={true}
        component={() => <ContentBox title={`${fetchText ?? '取证'}人员信息`}><Officer /></ContentBox>} />
    <Route
        path="/settings/officer/:id"
        component={() => <ContentBox title={`编辑${fetchText ?? '取证'}人员`}><OfficerEdit /></ContentBox>} />
    <Route
        path="/settings/keywords"
        component={() => <ContentBox title="关键词配置"><Keywords /></ContentBox>} />
    <Route
        path="/settings/check-manage"
        component={() => <ContentBox title="点验记录管理"><CheckManage /></ContentBox>} />
    <Route
        path="/settings/trace-login"
        component={() => <ContentBox title="云点验登录"><TraceLogin /></ContentBox>} />
    <Route
        path="/settings/ftp"
        component={() => <ContentBox title="BCP文件上传配置"><Ftp /></ContentBox>} />
    <Route
        path="/settings/login-config"
        component={() => <ContentBox title="登录验证配置"><LoginConfig /></ContentBox>} />
    <Route
        path="/settings/version"
        component={() => <ContentBox title="软件版本"><Version /></ContentBox>} />
</SettingLayout>;

export default Index;
