import round from 'lodash/round';
import path from 'path';
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

const cwd = process.cwd();
const { useBcp, useServerCloud, useTraceLogin, cloudAppMd5, cloudAppUrl } = helper.readConf()!;

export default {
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
     * 查询软硬件配置信息
     * 写入LocalStorage（创建BCP需要此数据）
     */
    async queryManufacturer() {
        const jsonPath =
            process.env['NODE_ENV'] === 'development'
                ? path.join(cwd, './data/manufaturer.json')
                : path.join(cwd, './resources/config/manufaturer.json');
        try {
            const exist = await helper.existFile(jsonPath);
            if (exist) {
                const data = await helper.readManufaturer();
                localStorage.setItem('manufacturer', data?.manufacturer ?? '');
                localStorage.setItem('security_software_orgcode', data?.security_software_orgcode ?? '');
                localStorage.setItem('materials_name', data?.materials_name ?? '');
                localStorage.setItem('materials_model', data?.materials_model ?? '');
                localStorage.setItem('materials_hardware_version', data?.materials_hardware_version ?? '');
                localStorage.setItem('materials_software_version', data?.materials_software_version ?? '');
                localStorage.setItem('materials_serial', data?.materials_serial ?? '');
                localStorage.setItem('ip_address', data?.ip_address ?? '');
            } else {
                localStorage.setItem('manufacturer', '');
                localStorage.setItem('security_software_orgcode', '');
                localStorage.setItem('materials_name', '');
                localStorage.setItem('materials_model', '');
                localStorage.setItem('materials_hardware_version', '');
                localStorage.setItem('materials_software_version', '');
                localStorage.setItem('materials_serial', '');
                localStorage.setItem('ip_address', '');
            }
        } catch (error) {
            logger.error(`软硬件信息数据写入LocalStorage失败：${error.message}`);
        }
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
        // ipcRenderer.on('update-export-msg', (event: IpcRendererEvent, args: AlarmMessageInfo) => {
        //     dispatch({ type: 'updateAlertMessage', payload: args });
        // });
        //legacy:待还原上面类型
        ipcRenderer.on('update-export-msg', (event: IpcRendererEvent, args: any) => {
            dispatch({ type: 'alartMessage/updateAlertMessage', payload: args });
        });
    },
    /**
     * 应用所在盘容量过底警告
     */
    async appSpaceWarning() {
        const { root } = path.parse(cwd);
        const [disk] = root.split(path.sep);

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
        ipcRenderer.on('go-to-url', (event: IpcRendererEvent, url: string) => {
            dispatch(routerRedux.push(url));
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