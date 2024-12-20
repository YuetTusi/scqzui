import React, { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEraser, faBuilding, faBuildingColumns, faPenRuler, faWrench,
    faBell, faBellSlash, faMobileScreenButton, faArrowsRotate,
    faCloud, faRecycle
} from '@fortawesome/free-solid-svg-icons';
import Popover from 'antd/lib/popover';
import { helper } from '@/utils/helper';
import { LocalStoreKey } from '@/utils/local-store';
import Auth from '../auth';
import { MenuBox } from './styled/menu';

const { fetchText, parseText } = helper.readConf()!;

interface MenuProp {
    /**
     * 菜单项Click
     */
    onItemClick: (type: BoardMenuAction) => void
};

enum BoardMenuAction {
    /**
     * 清输入历史记录
     */
    HistoryClear,
    /**
     * 软硬件配置
     */
    Manufaturer,
    /**
     * 开发者工具
     */
    DevTool,
    /**
     * 采集日志
     */
    FetchLog,
    /**
     * 解析日志
     */
    ParseLog,
    /**
     * 云取日志
     */
    CloudLog,
    /**
     * 旧nedb数据导入
     */
    NedbImport,
    /**
     * 单位设置
     */
    UnitClear,
    /**
     * 目的单位设置
     */
    DstUnitClear
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
        <li onClick={() => onItemClick(BoardMenuAction.UnitClear)}>
            <FontAwesomeIcon icon={faBuilding} />
            <span>{`${fetchText ?? '采集'}单位管理`}</span>
        </li>
        <li onClick={() => onItemClick(BoardMenuAction.DstUnitClear)}>
            <FontAwesomeIcon icon={faBuildingColumns} />
            <span>目的检验单位管理</span>
        </li>
        <li onClick={() => onItemClick(BoardMenuAction.NedbImport)}>
            <FontAwesomeIcon icon={faRecycle} />
            <span>旧版本数据导入</span>
        </li>
        <Auth deny={!isDev}>
            <li onClick={() => onItemClick(BoardMenuAction.FetchLog)}>
                <FontAwesomeIcon icon={faMobileScreenButton} />
                <span>{`${fetchText ?? '取证'}日志管理`}</span>
            </li>
            <li onClick={() => onItemClick(BoardMenuAction.ParseLog)}>
                <FontAwesomeIcon icon={faArrowsRotate} />
                <span>{`${parseText ?? '解析'}日志管理`}</span>
            </li>
            <li onClick={() => onItemClick(BoardMenuAction.CloudLog)}>
                <FontAwesomeIcon icon={faCloud} />
                <span>云取日志管理</span>
            </li>
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
                <span>开启/关闭断线警告</span>
            </li>
            <li
                onClick={() => onItemClick(BoardMenuAction.DevTool)}>
                <FontAwesomeIcon icon={faWrench} />
                <span>开发者工具</span>
            </li>
        </Auth>
    </MenuBox>
}

/**
 * 弹出菜单
 */
const BoardMenu: FC<MenuProp> = ({ onItemClick, children }) => <Popover
    content={<MenuItems onItemClick={onItemClick} />}
    trigger="click"
    placement="bottomLeft">
    {children}
</Popover>;

export { BoardMenu, BoardMenuAction };