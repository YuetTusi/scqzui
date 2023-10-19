import { join } from 'path';
import debounce from 'lodash/debounce';
import { ipcRenderer, shell } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, routerRedux } from 'dva';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import Auth from '../auth';
import { BackgroundBox, Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';
import DragBar from '../drag-bar';
import { Copyright } from './copyright';
import { BoardMenu, BoardMenuAction } from './board-menu';
import SofthardwareModal from '../softhardware-modal';
import InputHistoryModal from '../input-history-modal';
import NedbImportModal, { importPrevNedb } from '../nedb-import-modal';
import { UnorderList } from '../style-tool/list';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';
const { fetchText, useBcp, useLogin, max } = helper.readConf()!;

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
    const url = isDev
        ? join(cwd, './data/help/帮助.pdf')
        : join(cwd, './resources/help/帮助.pdf');
    try {
        const exist = await helper.existFile(url);
        message.destroy();
        if (exist) {
            message.info('正在打开帮助文档...');
            await shell.openPath(url);
        } else {
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
    const [version, setVersion] = useState<string>('');
    const [manu, setManu] = useState<string>('');
    const [isDebug, setIsDebug] = useState<boolean>(false);
    const [softhardwareModalVisible, setSofthardwareModalVisible] = useState<boolean>(false);
    const [inputHistoryModalVisbile, setInputHistoryModalVisible] = useState<boolean>(false);
    const [nedbImportModalVisbile, setNedbImportModalVisbile] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const {
                    manufacturer,
                    materials_name,
                    materials_software_version
                } = await helper.readManufaturer();
                setManu(manufacturer ?? '北京万盛华通科技有限公司');
                setTitle(materials_name ?? '智能终端取证系统');
                setVersion(materials_software_version ?? 'v0.0.1');
            } catch (error) {
                console.warn(error);
                setTitle('');
                setVersion('');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsDebug(await helper.isDebug());
        })();
    }, []);


    /**
 * 用户登出
 */
    const logoutClick = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        dispatch(routerRedux.push('/'));
    };

    /**
     * 导入旧版数据handle
     * @param dir 原Nedb目录
     */
    const onImportHandle = async (dir: string) => {

        const handle = Modal.info({
            title: '导入原数据',
            content: '正在检测数据...',
            okText: '确定',
            icon: <LoadingOutlined />,
            okButtonProps: { disabled: true },
            centered: true
        });

        try {
            const exist = await helper.existFile(join(dir, './Case.nedb'));
            if (exist) {
                const [caseCount, eventCount, deviceCount, recordCount] = await importPrevNedb(dir);

                handle.update({
                    onOk() {
                        setNedbImportModalVisbile(false);
                    },
                    title: '导入成功',
                    content: <UnorderList>
                        <li>案件<em>{caseCount}</em>条</li>
                        <li>案件设备<em>{eventCount}</em>条</li>
                        <li>快速{fetchText ?? '点验'}<em>{deviceCount}</em>条</li>
                        <li>快速{fetchText ?? '点验'}设备<em>{recordCount}</em>条</li>
                    </UnorderList>,
                    icon: <CheckCircleOutlined />,
                    okButtonProps: { disabled: false }
                });
            } else {
                handle.update({
                    title: '导入失败',
                    content: '该目录下无数据文件，请确认选择目录正确',
                    icon: <WarningOutlined style={{ color: '#f9ca24' }} />,
                    okButtonProps: { disabled: false }
                });
            }
        } catch (error) {
            handle.update({
                title: '导入失败',
                content: error.message,
                icon: <WarningOutlined style={{ color: '#f9ca24' }} />,
                okButtonProps: { disabled: false }
            });
        }
    };

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
            case BoardMenuAction.FetchLog:
                dispatch(routerRedux.push('/log?admin=1'));
                break;
            case BoardMenuAction.ParseLog:
                dispatch(routerRedux.push('/log/parse-log?admin=1'));
                break;
            case BoardMenuAction.CloudLog:
                dispatch(routerRedux.push('/log/cloud-log?admin=1'));
                break;
            case BoardMenuAction.NedbImport:
                setNedbImportModalVisbile(true);
                break;
            case BoardMenuAction.UnitClear:
                useBcp
                    ?
                    dispatch(routerRedux.push('/settings?admin=1'))
                    :
                    dispatch(routerRedux.push('/settings/self-unit?admin=1'));
                break;
            case BoardMenuAction.DstUnitClear:
                dispatch(routerRedux.push('/settings/dst-unit?admin=1'))
                break;
            default:
                console.warn('未知菜单项');
                break;
        }
    };

    return <>
        <BackgroundBox>
            <DragBar />
            <Header>
                <div className="header-caption">
                    <span>{title}</span>
                    <Auth deny={!isDebug}>
                        <span style={{ color: '#f9ca24' }}>{max}路</span>
                    </Auth>
                    <em onClick={() => dispatch(routerRedux.push('/settings/version'))}>
                        {filterCharactor(version)}
                    </em>
                </div>
                <div className="header-buttons">
                    <Auth deny={!useLogin}>
                        <LogoutOutlined onClick={logoutClick} title="用户登出" />
                    </Auth>
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
                <Copyright>{manu}</Copyright>
            </Footer>
        </BackgroundBox>
        <SofthardwareModal
            visible={softhardwareModalVisible}
            closeHandle={() => setSofthardwareModalVisible(false)} />
        <InputHistoryModal
            visible={inputHistoryModalVisbile}
            closeHandle={() => setInputHistoryModalVisible(false)} />
        <NedbImportModal
            visible={nedbImportModalVisbile}
            importHandle={onImportHandle}
            cancelHandle={() => setNedbImportModalVisbile(false)} />
    </>
};

export default BoardPanel;