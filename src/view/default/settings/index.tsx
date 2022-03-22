import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faRegistered, faCrosshairs, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Route } from 'dva/router';
import Reading from '@/component/loading/reading';
import AlartMessage from '@/component/alert-message';
import Unit from '@/view/default/settings/unit';
import DstUnit from '@/view/default/settings/dst-unit';
import Officer from '@/view/default/settings/officer';
import OfficerEdit from '@/view/default/settings/officer/edit';
import Version from '@/view/default/settings/version';
import { MenuPanel } from './styled/menu';
import { SettingLayout } from './styled/sub-layout';
import ContentBox from './content-box';

// const { max, useBcp, useTraceLogin } = helper.readConf()!;

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
            <li>
                <NavLink to="/settings" exact={true} replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faBuildingColumns} /></span>
                        <span className="name">采集单位</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings/dst-unit" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faCrosshairs} /></span>
                        <span className="name">目的检验单位</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings/officer" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faUser} /></span>
                        <span className="name">采集人员信息</span>
                    </div>
                </NavLink>
            </li>
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
        path="/settings/officer"
        exact={true}
        component={() => <ContentBox title="采集人员信息"><Officer /></ContentBox>} />
    <Route
        path="/settings/officer/:id"
        component={() => <ContentBox title="编辑采集人员"><OfficerEdit /></ContentBox>} />
    <Route
        path="/settings/version"
        component={() => <ContentBox title="软件版本"><Version /></ContentBox>} />
</SettingLayout>;

export default Index;
