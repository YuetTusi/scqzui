import React, { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPenRuler, faWrench, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import Popover from 'antd/lib/popover';
import { helper } from '@/utils/helper';
import { LocalStoreKey } from '@/utils/local-store';
import Auth from '../auth';
import { MenuBox } from './styled/menu';

const cwd = process.cwd();

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

    const [isDev, setIsDev] = useState<boolean>(false);
    const [isWarning, setIsWarning] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const idDebug = await helper.isDebug();
                setIsDev(idDebug);
            } catch (error) {
                setIsDev(false);
            }
        })();
    }, []);

    useEffect(() => {
        setIsWarning(localStorage.getItem(LocalStoreKey.SocketWarning) === '1');
    }, []);

    return <MenuBox>
        <li onClick={() => onItemClick(BoardMenuAction.HistoryClear)}>
            <FontAwesomeIcon icon={faEraser} />
            <span>表单记录清除</span>
        </li>
        <Auth deny={!isDev}>
            <li
                onClick={() => onItemClick(BoardMenuAction.Manufaturer)}>
                <FontAwesomeIcon icon={faPenRuler} />
                <span>软硬件信息配置</span>
            </li>
            <li onClick={() => {
                localStorage.setItem(LocalStoreKey.SocketWarning, isWarning ? '0' : '1');
                setIsWarning(!isWarning);
            }}>
                <FontAwesomeIcon icon={isWarning ? faBell : faBellSlash} />
                <span>开关服务中断警告</span>
            </li>
            <li
                onClick={() => onItemClick(BoardMenuAction.DevTool)}>
                <FontAwesomeIcon icon={faWrench} />
                <span>打开开发者工具</span>
            </li>
        </Auth>
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