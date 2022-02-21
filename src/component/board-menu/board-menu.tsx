import React, { FC } from 'react';
import BoardButton from './board-button';
import { BoardMenuProp } from './prop';
import { MenuPanel } from './styled/menu-panel';

/**
 * 主屏菜单
 */
const BoardMenu: FC<BoardMenuProp> = () => {

    return <MenuPanel>
        <div><BoardButton color="#F97F51">案件管理</BoardButton></div>
        <div><BoardButton color="#1B9CFC">工具箱</BoardButton></div>
        <div><BoardButton color="#58B19F">设备取证</BoardButton></div>
        <div><BoardButton color="#3B3B98">数据解析</BoardButton></div>
        <div><BoardButton color="#BDC581">操作日志</BoardButton></div>
        <div><BoardButton color="#FD7272">软件设置</BoardButton></div>
    </MenuPanel>;
};

export default BoardMenu;