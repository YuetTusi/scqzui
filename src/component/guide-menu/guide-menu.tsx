import React, { FC } from 'react';
import { NavLink } from 'dva/router';
import { MenuPanel } from './styled/menu-panel';
import BoardButton from './guide-button';
import { GuideMenuProp } from './prop';

/**
 * 主屏菜单
 */
const GuideMenu: FC<GuideMenuProp> = () => {

    return <MenuPanel>
        <div className="evidence"><BoardButton color="#58B19F">设备取证</BoardButton></div>
        <div className="case"><BoardButton color="#F97F51">案件管理</BoardButton></div>
        <div className="tool"><BoardButton color="#1B9CFC">工具箱</BoardButton></div>
        <div className="parse"><BoardButton color="#3B3B98">数据解析</BoardButton></div>
        <div className="log"><BoardButton color="#BDC581">操作日志</BoardButton></div>
        <div className="setting">
            <BoardButton color="#FD7272">
                <NavLink to={'/settings'} replace={true}>
                    <span>软件设置</span>
                </NavLink>
            </BoardButton>
        </div>
    </MenuPanel>;
};

export default GuideMenu;