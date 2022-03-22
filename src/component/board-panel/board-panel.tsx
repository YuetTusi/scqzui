import debounce from 'lodash/debounce';
import { join } from 'path';
import { shell } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import message from 'antd/lib/message';
import { BoardMenu } from './board-menu';
import { Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';
import { helper } from '@/utils/helper';
import { useDispatch } from 'dva';
import DragBar from '../drag-bar';

const cwd = process.cwd();
const caption = helper.readAppName();

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

    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const { materials_name, materials_software_version } = await helper.readManufaturer();
                setTitle(`${materials_name} ${materials_software_version}`);
            } catch (error) {
                console.warn(error);
                setTitle('');
            }
        })();
    }, []);

    return <>
        <DragBar />
        <Header>
            <div className="header-caption">{caption ?? ''}</div>
            <div className="header-buttons">
                <QuestionCircleOutlined onClick={openHelpDocClick} title="帮助文档" />
                <BoardMenu><MenuOutlined /></BoardMenu>
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
    </>
};

export default BoardPanel;
function setTitle(arg0: string) {
    throw new Error('Function not implemented.');
}

