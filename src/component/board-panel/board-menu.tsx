import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPenRuler, faWrench } from '@fortawesome/free-solid-svg-icons';
import Popover from 'antd/lib/popover';
import { MenuBox } from './styled/menu';

interface MenuProp {
    /**
     * 菜单项Click
     */
    onItemClick: (type: BoardMenuAction) => void
};

enum BoardMenuAction {
    HistoryClear,
    Manufaturer,
    DevTool
}

const MenuItems: FC<MenuProp> = ({ onItemClick }) => {
    return <MenuBox>
        <li onClick={() => onItemClick(BoardMenuAction.HistoryClear)}>
            <FontAwesomeIcon icon={faEraser} />
            <span>表单记录清除</span>
        </li>
        <li
            onClick={() => onItemClick(BoardMenuAction.Manufaturer)}>
            <FontAwesomeIcon icon={faPenRuler} />
            <span>软硬件信息配置</span>
        </li>
        <li
            onClick={() => onItemClick(BoardMenuAction.DevTool)}>
            <FontAwesomeIcon icon={faWrench} />
            <span>打开开发者工具</span>
        </li>
    </MenuBox>
}

const BoardMenu: FC<MenuProp> = ({ onItemClick, children }) => {

    return <Popover
        content={<MenuItems onItemClick={onItemClick} />}
        trigger="click"
        placement="bottomLeft">
        {children}
    </Popover>
};

export { BoardMenu, BoardMenuAction };