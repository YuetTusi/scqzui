import debounce from 'lodash/debounce';
import { join } from 'path';
import { ipcRenderer, shell } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';
import DragBar from '../drag-bar';
import { BoardMenu, BoardMenuAction } from './board-menu';
import SofthardwareModal from '../softhardware-modal';
// import { useDispatch } from 'dva';
import InputHistoryModal from '../input-history-modal';

const cwd = process.cwd();

/**
 * 过滤-字符
 */
const filterCharactor = (text?: string) =>
    text === undefined ? '' : text.replaceAll('-', '.');

/**
 * 打开帮助文档
 */
const openHelpDocClick = debounce(async (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const url = join(cwd, './data/help/帮助.doc');
    try {
        const exist = await helper.existFile(url);
        if (exist) {
            await shell.openPath(url);
        } else {
            message.destroy();
            message.info('暂未提供帮助文档');
        }
    } catch (error) {
        console.warn(error);
    }
}, 1000, { leading: true, trailing: false });

/**
 * @description 首屏按钮面板
 */
const BoardPanel: FC<{}> = ({ children }) => {

    const [title, setTitle] = useState<string>('');
    const [softhardwareModalVisible, setSofthardwareModalVisible] = useState<boolean>(false);
    const [inputHistoryModalVisbile, setInputHistoryModalVisible] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const { materials_name, materials_software_version } = await helper.readManufaturer();
                setTitle(`${materials_name} ${filterCharactor(materials_software_version)}`);
            } catch (error) {
                console.warn(error);
                setTitle('');
            }
        })();
    }, []);

    /**
     * 菜单项Click
     * @param type 类型
     */
    const onItemClick = (type: BoardMenuAction) => {
        switch (type) {
            case BoardMenuAction.HistoryClear:
                setInputHistoryModalVisible(true);
                break;
            case BoardMenuAction.Manufaturer:
                setSofthardwareModalVisible(true);
                break;
            case BoardMenuAction.DevTool:
                ipcRenderer.send('dev-tool');
                break;
            default:
                break;
        }
    };

    return <>
        <DragBar />
        <Header>
            <div className="header-caption">{title ?? ''}</div>
            <div className="header-buttons">
                <QuestionCircleOutlined onClick={openHelpDocClick} title="帮助文档" />
                <BoardMenu onItemClick={onItemClick}>
                    <MenuOutlined />
                </BoardMenu>
            </div>
        </Header>
        <Center>
            {children}
        </Center>
        <Footer>
            <div>
                Copyright © 2022 北京万盛华通科技有限公司
            </div>
        </Footer>
        <SofthardwareModal
            visible={softhardwareModalVisible}
            closeHandle={() => setSofthardwareModalVisible(false)} />
        <InputHistoryModal
            visible={inputHistoryModalVisbile}
            closeHandle={() => setInputHistoryModalVisible(false)} />
    </>
};

export default BoardPanel;