import round from 'lodash/round';
import { join, parse, sep } from 'path';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { SubscriptionAPI } from 'dva';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import logger from '@/utils/log';
import { helper } from '@/utils/helper';
import { LocalStoreKey } from '@/utils/local-store';
import { request } from '@/utils/request';
import { ParseState } from '@/schema/device-state';
import { DataMode } from '@/schema/data-mode';
import { AppCategory } from '@/schema/app-config';
import { importPrevNedb } from '@/component/nedb-import-modal';

const cwd = process.cwd();
const {
    useLogin, useServerCloud, cloudAppMd5, cloudAppUrl
} = helper.readConf()!;

export default {
    /**
     * 跳转到第一页
     */
    toStartView({ dispatch }: SubscriptionAPI) {
        //NOTE: 如果启用了登录页则跳转到/login，否则直接进入/guide
        const login = sessionStorage.getItem('login');
        const toView = useLogin ? '/' : '/guide';
        if (login === null) {
            dispatch(routerRedux.push(toView));
            sessionStorage.setItem('login', '1');
        }
    },
    /**
     * 退出应用
     */
    exitApp({ dispatch }: SubscriptionAPI) {
        ipcRenderer.on('will-close', (event: IpcRendererEvent) => {
            dispatch({ type: 'fetchingAndParsingState' });
        });
    },
    /**
     * 启动应用时更新所有设备为`解析中`的记录
     */
    initAllDeviceParseState({ dispatch }: SubscriptionAPI) {
        //NOTE: 当设备还有正在解析或采集时关闭了应用，下一次启动
        //NOTE: UI时要把所有为`解析中`和`采集中`的设备更新为`未解析`
        dispatch({ type: 'updateAllDeviceParseState', payload: ParseState.NotParse });
    },
    /**
     * 读取conf配置文件、JSON等
     */
    async initConfig({ dispatch }: SubscriptionAPI) {
        try {
            const [checkJson, platformJson] = await Promise.all([
                helper.readCheckJson(),
                Promise.resolve(null) //TODO:在此读取platform.json文件
            ]);
            if (checkJson !== null && checkJson.isCheck) {
                dispatch({ type: 'setDataMode', payload: DataMode.Check });
            } else if (platformJson !== null && (platformJson as any).usePlatform) {
                dispatch({ type: 'setDataMode', payload: DataMode.GuangZhou });
            } else {
                dispatch({ type: 'setDataMode', payload: DataMode.Self });
            }
        } catch (error) {
            dispatch({ type: 'setDataMode', payload: DataMode.Self });
        }
    },
    /**
     * 备份旧版本数据表
     */
    async backupPrevNedb({ dispatch }: SubscriptionAPI) {
        const hasBackup = localStorage.getItem(LocalStoreKey.BakPrevNedb) === '1'; //是否已备份过旧表数据
        if (!hasBackup) {
            try {
                const [caseCount, eventCount, deviceCount, recordCount] = await importPrevNedb(join(cwd, './nedb'));
                localStorage.setItem(LocalStoreKey.BakPrevNedb, '1');
                logger.info(`已成功备份旧库数据 caseCount:${caseCount}, eventCount:${eventCount}, deviceCount:${deviceCount}, recordCount:${recordCount}`);
            } catch (error) {
                logger.error(`备份旧库数据失败 @model/default/app-set/subscriptions/backupPrevNedb: ${error.message}`);
            }
        }
    },
    /**
     * 导出报告消息
     */
    reportExportMessage({ dispatch }: SubscriptionAPI) {
        ipcRenderer.on('report-export-finish', (event: IpcRendererEvent,
            success: boolean, exportCondition: Record<string, any>,
            isBatch: boolean, msgId: string) => {
            const { reportName } = exportCondition;
            dispatch({ type: 'alartMessage/removeAlertMessage', payload: msgId });
            dispatch({ type: 'operateDoing/setExportingDeviceId', payload: [] });
            if (isBatch) {
                if (success) {
                    notification.success({
                        type: 'success',
                        message: '批量导出报告成功',
                        description: `所有报告已成功导出`,
                        duration: 0
                    });
                } else {
                    notification.error({
                        type: 'error',
                        message: '批量导出报告失败',
                        description: `批量导出报告失败`,
                        duration: 0
                    });
                }
            } else {
                if (success) {
                    notification.success({
                        type: 'success',
                        message: '报告导出成功',
                        description: `「${reportName}」已成功导出`,
                        duration: 0
                    });
                } else {
                    notification.error({
                        type: 'error',
                        message: '报告导出失败',
                        description: `「${reportName}」导出失败`,
                        duration: 0
                    });
                }
            }
        });

        ipcRenderer.on('update-export-msg', (event: IpcRendererEvent, args: any) => {
            dispatch({ type: 'alartMessage/updateAlertMessage', payload: args });
        });
    },
    /**
     * 应用所在盘容量过底警告
     */
    async appSpaceWarning() {
        const { root } = parse(cwd);
        const [disk] = root.split(sep);

        try {
            const { FreeSpace } = await helper.getDiskInfo(disk, true);
            if (FreeSpace <= 5) {
                logger.warn(`取证程序所在磁盘空间不足，${disk}剩余${round(FreeSpace, 2)}GB，强制退出`);
                Modal.warn({
                    title: '磁盘空间不足',
                    content: `软件所在磁盘（${disk}）空间不足，请清理数据`,
                    okText: '退出',
                    centered: true,
                    onOk() {
                        ipcRenderer.send('do-close');
                    }
                });
            }
        } catch (error) {
            logger.error(`查询磁盘容量失败,盘符:${disk},错误消息：${error.message}`);
        }
    },
    /**
     * 调用接口查询云取App
     */
    async validCloudAppMd5({ dispatch }: SubscriptionAPI) {

        const md5Url = cloudAppMd5 ?? helper.VALID_CLOUD_APP_URL;
        const fetchUrl = cloudAppUrl ?? helper.FETCH_CLOUD_APP_URL;

        if (useServerCloud) {
            let hide = message.loading('正在获取云取应用...');
            try {
                const [res, { code, data }] = await Promise.all([
                    fetch(md5Url),
                    request<{ fetch: AppCategory[] }>(fetchUrl)
                ]);
                if (res.status >= 200 && res.status < 300) {
                    const md5 = await res.text();
                    if (code === 0) {
                        dispatch({ type: 'setCloudAppData', payload: data.fetch });
                        hide();
                    } else {
                        hide();
                        message.error('云取证应用数据获取失败');
                        logger.error(`云取证应用数据获取失败 @model/default/app-set/subscriptions/validCloudAppMd5: request()查询结果错误`);
                    }
                    localStorage.setItem(LocalStoreKey.CloudAppMd5, md5);
                }
            } catch (error) {
                logger.error(`云取证应用数据获取失败 @model/default/app-set/subscriptions/validCloudAppMd5: ${error.message}`);
                hide();
                message.error('云取证应用数据获取失败');
            }
        }
    },
    /**
     * 跳转页面
     */
    gotoUrl({ dispatch }: SubscriptionAPI) {
        ipcRenderer.on('go-to-url', (event: IpcRendererEvent, url: string, state: any) => {
            dispatch(routerRedux.push(url, state));
        });
    },
    /**
     * 读取本地存储发送给主进程
     */
    getStorage() {
        ipcRenderer.on('get-storage', (event: IpcRendererEvent, key: string) => {
            ipcRenderer.send('get-storage', localStorage.getItem(key));
        });
    },
    /**
     * 设置加载状态
     */
    setLoading({ dispatch }: SubscriptionAPI) {
        dispatch({ type: 'setReading', payload: true });
        setTimeout(() =>
            dispatch({ type: 'setReading', payload: false }), 1000);
    }
};