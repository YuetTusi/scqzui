import { join } from 'path';
import debounce from 'lodash/debounce';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'dva';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { QuickEvent } from '@/schema/quick-event';
import { CheckingPanel, QuickBox, TableBox } from './styled/style';
import EventList from './quick-event-list';
import EditQuickEventModal from './edit-quick-event-modal';
import EventDescModal from './event-desc-modal';
import CheckingList from './checking-list';
import RecordList from './record-list';
import { getEventByName, importRec, readCaseJson, readDirOnly } from './util';
import { QuickProp } from './prop';

const { fetchText, caseText, devText } = helper.readConf()!;

/**
 * 快速点验
 */
const Quick: FC<QuickProp> = () => {

    const dispatch = useDispatch();
    const ipList = useRef<string[]>(helper.QUICK_QR_IP);//IP列表
    const portOccupy = useRef<boolean>(false); //端口占用
    const [detailId, setDetailId] = useState<string>('');
    const [ip, setIp] = useState<string>('127.0.0.1');
    const [eventDescVisible, setEventDescVisible] = useState<boolean>(false);

    useEffect(() => {
        let nextHttp = 9900;
        let nextService = 57999;
        (async () => {
            try {
                [nextHttp, nextService] = await Promise.all([
                    helper.portStat(9900),
                    helper.portStat(57999)
                ]);
                if (nextHttp !== 9900 || nextService !== 57999) {
                    portOccupy.current = true;
                } else {
                    portOccupy.current = false;
                }
            } catch (err) {
                console.warn(err);
                portOccupy.current = true;
            }
        })();
    }, []);

    /**
     * 详情handle
     */
    const detailHandle = debounce(({ _id }: QuickEvent) => {

        const allowIp = ipList.current.reduce<string[]>((acc, current) => {
            if (helper.hasIP(current)) {
                acc.push(current);
            }
            return acc;
        }, []);
        if (portOccupy.current) {
            Modal.warn({
                title: '端口占用',
                content: `点验端口已被其他服务占用，请检查`,
                okText: '确定',
                centered: true
            });
        } else if (allowIp.length === 0) {
            Modal.warn({
                title: '生成二维码失败',
                content: '未检测到采集WiFi或路由器，请确认WiFi正常或连接采集盒子',
                okText: '确定',
                centered: true
            });
        } else {
            setIp(allowIp[0]);
            setDetailId(_id!);
            setEventDescVisible(true);
        }
    }, 500, { leading: true, trailing: false });

    /**
    * 导入
    * @param caseJsonPath 案件Case.json路径
    */
    const startImportCase = async (caseJsonPath: string) => {
        const modal = Modal.info({
            content: `正在导入，请稍后...`,
            okText: '确定',
            maskClosable: false,
            centered: true,
            okButtonProps: { disabled: true }
        });

        try {
            const caseJson = await readCaseJson(caseJsonPath);
            if (helper.isNullOrUndefinedOrEmptyString(caseJson.caseName)) {
                throw new Error(`无法读取数据，请选择Case.json文件`);
            }
            if (caseJson.caseType !== 1) {
                throw new Error(`此${caseText ?? '案件'}为深度点验数据`);
            }
            const casePath = join(caseJsonPath, '../../');
            const caseSavePath = join(caseJsonPath, '../');
            const eventData = await getEventByName(caseJson, casePath);
            const holderDir = await readDirOnly(caseSavePath);
            const holderFullDir = holderDir.map((i) => join(caseSavePath, i));

            let allDeviceJsonPath: string[] = [];
            for (let i = 0; i < holderFullDir.length; i++) {
                const devicePath = await readDirOnly(holderFullDir[i]);

                for (let j = 0; j < devicePath.length; j++) {
                    allDeviceJsonPath = allDeviceJsonPath.concat([
                        join(holderFullDir[i], devicePath[j], 'Device.json')
                    ]);
                }
            }
            const importTasks = allDeviceJsonPath.map((i) => importRec(i, eventData));
            await Promise.allSettled(importTasks);

            modal.update({
                content: `导入成功`,
                okButtonProps: { disabled: false }
            });
        } catch (error) {
            modal.update({
                title: `导入失败`,
                content: error.message,
                okButtonProps: { disabled: false }
            });
        } finally {
            dispatch({
                type: 'quickEventList/query', payload: {
                    pageIndex: 1, pageSize: 5
                }
            });
            setTimeout(() => {
                modal.destroy();
            }, 3000);
        }
    };

    /**
     * 案件/检材选择
     * @param {boolean} isCase 是否是案件
     */
    const selectImportHandle = debounce(
        async () => {
            const dialogVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                title: '请选择 Case.json 文件',
                properties: ['openFile'],
                filters: [
                    { name: 'Case.json文件', extensions: ['json'] }
                ]
            });

            if (dialogVal.filePaths.length > 0) {
                startImportCase(dialogVal.filePaths[0]);
            }
        },
        400,
        { leading: true, trailing: false }
    );

    /**
     * 添加Click
     */
    const onAddClick = (event: MouseEvent) => {
        event.preventDefault();
        dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
    };

    /**
     * 导入Click
     */
    const onImportClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        selectImportHandle();
    };

    return <SubLayout title={`快速${fetchText ?? '点验'}`}>
        <QuickBox>
            <div className="search-bar">
                <Button onClick={onImportClick} type="primary">
                    <ImportOutlined />
                    <span>导入案件</span>
                </Button>
                <Button onClick={onAddClick} type="primary">
                    <PlusCircleOutlined />
                    <span>添加{fetchText ?? '点验'}</span>
                </Button>
            </div>
            <Split />
            <CheckingPanel>
                <CheckingList />
            </CheckingPanel>
            <Split />
            <TableBox>
                <div className="case-list">
                    <div className="title-bar">
                        {`${fetchText ?? '点验'}${caseText ?? '案件'}`}
                    </div>
                    <div>
                        <EventList
                            detailHandle={detailHandle} />
                    </div>
                </div>
                <div className="dev-list">
                    <div className="title-bar">
                        {devText ?? '设备'}
                    </div>
                    <div>
                        <RecordList />
                    </div>
                </div>
            </TableBox>
        </QuickBox>
        <EditQuickEventModal />
        <EventDescModal
            cancelHandle={() => {
                setEventDescVisible(false)
            }}
            visible={eventDescVisible}
            id={detailId}
            ip={ip}
        />
    </SubLayout>;
}

export default Quick;