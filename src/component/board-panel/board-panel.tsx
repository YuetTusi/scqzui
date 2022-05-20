import { join } from 'path';
import debounce from 'lodash/debounce';
import differenceWith from 'lodash/differenceWith';
import { ipcRenderer, shell } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, routerRedux } from 'dva';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { Db, getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { CaseInfo } from '@/schema/case-info';
import { DeviceType } from '@/schema/device-type';
import { QuickEvent } from '@/schema/quick-event';
import { QuickRecord } from '@/schema/quick-record';
import { TableName } from '@/schema/table-name';
import { BackgroundBox, Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';
import DragBar from '../drag-bar';
import { BoardMenu, BoardMenuAction } from './board-menu';
import SofthardwareModal from '../softhardware-modal';
import InputHistoryModal from '../input-history-modal';
import NedbImportModal from '../nedb-import-modal';
import { UnorderList } from '../style-tool/list';

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
    const [softhardwareModalVisible, setSofthardwareModalVisible] = useState<boolean>(false);
    const [inputHistoryModalVisbile, setInputHistoryModalVisible] = useState<boolean>(false);
    const [nedbImportModalVisbile, setNedbImportModalVisbile] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const { materials_name, materials_software_version } = await helper.readManufaturer();
                setTitle(materials_name ?? '智能终端取证系统');
                setVersion(materials_software_version ?? 'v0.0.1');
            } catch (error) {
                console.warn(error);
                setTitle('');
                setVersion('');
            }
        })();
    }, []);

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
                const originCaseDb = new Db<CaseInfo>('Case', join(dir, '../'));
                const originDeviceDb = new Db<DeviceType>('Device', join(dir, '../'));

                const caseDb = getDb<CaseInfo>(TableName.Case);
                const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
                const deviceDb = getDb<DeviceType>(TableName.Device);
                const recordDb = getDb<QuickRecord>(TableName.QuickRecord);

                const [
                    prevCase, //旧案件
                    prevDevice, //旧设备
                    nextCase,//新标准案件
                    nextEvent,//新快速点验案件
                    nextDevice,//新案件设备
                    nextRecord//新快速点验设备
                ] = await Promise.all([
                    originCaseDb.all(),
                    originDeviceDb.all(),
                    caseDb.all(),
                    eventDb.all(),
                    deviceDb.all(),
                    recordDb.all()
                ]);

                //将原数据表按caseType拆分为现在4张表
                const next = prevCase.reduce<{
                    normalCase: CaseInfo[],
                    quickEvent: QuickEvent[],
                    device: DeviceType[],
                    quickRecord: QuickRecord[]
                }>((acc, current) => {
                    if ((current as any).caseType === 1) {
                        //快速点验
                        acc.quickEvent.push({
                            _id: current._id,
                            eventName: current.m_strCaseName,
                            eventPath: current.m_strCasePath,
                            ruleFrom: (current as any)?.ruleFrom,
                            ruleTo: (current as any)?.ruleTo
                        });
                        acc.quickRecord = acc.quickRecord.concat(
                            prevDevice
                                .filter(item => item.caseId === current._id)
                                .map(item => ({ ...item, id: undefined }))
                        );
                    } else {
                        //标准案件
                        acc.normalCase.push(current);
                        acc.device = acc.device.concat(
                            prevDevice
                                .filter(item => item.caseId === current._id)
                                .map(item => ({ ...item, id: undefined }))
                        );
                    }
                    return acc;
                }, { normalCase: [], quickEvent: [], device: [], quickRecord: [] });

                const [caseCount, eventCount, deviceCount, recordCount] = await Promise.all([
                    caseDb.insert(differenceWith(next.normalCase, nextCase, (prev, next) => prev._id === next._id)),
                    eventDb.insert(differenceWith(next.quickEvent, nextEvent, (prev, next) => prev._id === next._id)),
                    deviceDb.insert(differenceWith(next.device, nextDevice, (prev, next) => prev._id === next._id)),
                    recordDb.insert(differenceWith(next.quickRecord, nextRecord, (prev, next) => prev._id === next._id)),
                ]);

                handle.update({
                    onOk() {
                        setNedbImportModalVisbile(false);
                    },
                    title: '导入成功',
                    content: <UnorderList>
                        <li>案件<em>{(caseCount as CaseInfo[]).length}</em>条</li>
                        <li>案件设备<em>{(eventCount as QuickEvent[]).length}</em>条</li>
                        <li>快速点验<em>{(deviceCount as DeviceType[]).length}</em>条</li>
                        <li>快速点验设备<em>{(recordCount as QuickRecord[]).length}</em>条</li>
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
            default:
                break;
        }
    };

    return <>
        <BackgroundBox>
            <DragBar />
            <Header>
                <div className="header-caption">
                    <span>{title}</span>
                    <em onClick={() => dispatch(routerRedux.push('/settings/version'))}>
                        {filterCharactor(version)}
                    </em>
                </div>
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