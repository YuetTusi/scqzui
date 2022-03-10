import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPenRuler, faWrench } from '@fortawesome/free-solid-svg-icons';
import Popover from 'antd/lib/popover';
import { MenuBox } from './styled/menu';

const MenuItems = () => {
    return <MenuBox>
        <li><FontAwesomeIcon icon={faEraser} /><span>表单记录清除</span></li>
        <li><FontAwesomeIcon icon={faPenRuler} /><span>软硬件信息配置</span></li>
        <li><FontAwesomeIcon icon={faWrench} /><span>打开开发者工具</span></li>
    </MenuBox>
}

const BoardMenu: FC<{}> = ({ children }) => {

    return <Popover
        content={<MenuItems />}
        trigger="click"
        placement="bottomLeft">
        {children}
    </Popover>
};

export { BoardMenu };