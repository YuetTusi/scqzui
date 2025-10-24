/**
 * 取证UI主进程入口文件
 * @author Yuet
 * @date 2022-08-16
 */
import { join } from 'path';
import {
    app, BrowserWindow, dialog, ipcMain, IpcMainEvent, globalShortcut, shell
} from 'electron';
import { WindowsBalloon } from 'node-notifier';
import cors from 'cors';
import express from 'express';
import { api } from './src/http/api';
import log from './src/utils/log';
import { helper } from './src/utils/helper';
import { Conf } from './src/type/model';
import {
    BatchExportTask, ExportCondition, TreeParam
} from './src/renderer/report/types';
import FetchLog from './src/schema/fetch-log';
import FetchRecord from './src/schema/fetch-record';
import FetchData from './src/schema/fetch-data';

const { env, platform, resourcesPath } = process;
const isDev = env['NODE_ENV'] === 'development';
const appPath = app.getAppPath();
const server = express();
const appName = helper.readAppName();

let config: Conf | null = null;
let existManuJson = false;
let mainWindow: BrowserWindow | null = null;
let timerWindow: BrowserWindow | null = null; //计时
let sqliteWindow: BrowserWindow | null = null; //SQLite查询
let fetchRecordWindow: BrowserWindow | null = null; //采集记录
let reportWindow: BrowserWindow | null = null; //报告
let protocolWindow: BrowserWindow | null = null; //协议阅读
let startupWindow: BrowserWindow | null = null; //服务启动
let imageVerifyWindow: BrowserWindow | null = null; //选图验证

const notifier = new WindowsBalloon({
    withFallback: false,
    customPath: undefined
});

//# 配置Http服务器相关
server.use(express.json());
server.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        optionsSuccessStatus: 200
    })
);

config = helper.readConf();
existManuJson = helper.existManufaturer(appPath);

if (config === null) {
    dialog.showErrorBox('启动失败', '配置文件读取失败, 请联系技术支持');
    app.exit(0);
}
if (!existManuJson) {
    dialog.showErrorBox('启动失败', 'manufaturer配置读取失败, 请联系技术支持');
    app.exit(0);
}

if (helper.useGPURender()) {
    log.info('启用GPU渲染');
} else {
    app.commandLine.appendSwitch('no-sandbox');
    app.commandLine.appendSwitch('--no-sandbox');
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-gpu-compositing');
    app.commandLine.appendSwitch('disable-gpu-rasterization');
    app.commandLine.appendSwitch('disable-gpu-sandbox');
    app.commandLine.appendSwitch('disable-software-rasterizer');
    app.disableHardwareAcceleration();
    log.info('禁用GPU渲染');
}

helper.writeReportJson(config!); //写report.json

/**
 * 销毁所有窗口
 */
function destroyAllWindow() {
    if (sqliteWindow !== null) {
        sqliteWindow.destroy();
        sqliteWindow = null;
    }
    if (protocolWindow !== null) {
        protocolWindow.destroy();
        protocolWindow = null;
    }
    if (imageVerifyWindow !== null) {
        imageVerifyWindow.destroy();
        imageVerifyWindow = null;
    }
    if (timerWindow !== null) {
        timerWindow.destroy();
        timerWindow = null;
    }
    if (fetchRecordWindow !== null) {
        fetchRecordWindow.destroy();
        fetchRecordWindow = null;
    }
    if (startupWindow !== null) {
        startupWindow.destroy();
        startupWindow = null;
    }
    if (mainWindow !== null) {
        mainWindow.destroy();
        mainWindow = null;
    }
}

/**
 * 退出应用
 */
function exitApp(platform: string) {
    if (platform !== 'darwin') {
        globalShortcut.unregisterAll();
        destroyAllWindow();
        app.exit(0);
    }
}

process.on('uncaughtException', (err) => {
    log.error(`UncaughtException in main.ts: ${err.message}`);
    app.exit(1);
});

app.on('render-process-gone', (_, webContents, { reason }) => {
    let errMsg: string | null = null;
    switch (reason) {
        case 'crashed':
            errMsg = '渲染进程崩溃';
            break;
        case 'oom':
            errMsg = '渲染进程启动内存不足';
            break;
        case 'launch-failed':
            errMsg = '渲染进程启动失败';
            break;
        case 'integrity-failure':
            errMsg = '渲染进程窗口代码完整性检查失败';
            break;
        case 'killed':
            errMsg = '渲染进程被外部终止';
            break;
        default:
            errMsg = `程序已崩溃 reason:${reason}`;
            break;
    }
    if (errMsg !== null) {
        log.error(
            `${errMsg} WebContents:${webContents.getTitle()}, reason:${reason}`
        );
    }
});


app.on('before-quit', () => {
    //移除mainWindow上的listeners
    if (mainWindow !== null) {
        mainWindow.removeAllListeners('close');
    }
});
app.on('window-all-closed', () => {
    app.exit(0);
});

app.whenReady()
    .then(() => helper.isDebug())
    .then(isDebug => {
        // #生产模式屏蔽快捷键（发布把注释放开）
        if (!isDebug) {
            globalShortcut.register('Control+R', () => {
                if (mainWindow && mainWindow.isFocused()) {
                    return false;
                }
            });
            globalShortcut.register('CommandOrControl+Shift+I', () => {
                if (mainWindow && mainWindow.isFocused()) {
                    return false;
                }
            });
        }
    });

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        //单例应用
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
            mainWindow.show();
        }
    });

    app.on('ready', () => {

        startupWindow = new BrowserWindow({
            title: '服务启动',
            width: 800,
            height: 400,
            show: false,
            webPreferences: {
                webSecurity: false,
                allowRunningInsecureContent: true,
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        startupWindow.webContents.on('did-finish-load', async () => {

            let nextServicePort = config!.tcpPort;
            let nextOcrPort = config!.ocrPort;
            let nextReaderPort = config!.readerPort;
            let nextAiPort = config!.aiPort;
            try {
                [nextServicePort, nextOcrPort, nextReaderPort, nextAiPort] = await Promise.all([
                    helper.portStat(config!.tcpPort ?? 35222),
                    helper.portStat(config!.ocrPort ?? 35116),
                    helper.portStat(config!.readerPort ?? 35336),
                    helper.portStat(config!.aiPort ?? 35226)
                ]);
            } catch (error) {
                console.warn(error);
                nextServicePort = config!.tcpPort ?? 35222;
                nextOcrPort = config!.ocrPort ?? 35116;
                nextReaderPort = config!.readerPort ?? 35336;
                nextAiPort = config!.aiPort ?? 35226;
            } finally {
                startupWindow!.webContents.send('startup', {
                    ...config,
                    servicePort: nextServicePort,
                    ocrPort: nextOcrPort,
                    readerPort: nextReaderPort,
                    aiPort: nextAiPort
                });
                helper.writeNetJson(helper.APP_CWD, {
                    apiPort: config!.httpPort,
                    servicePort: nextServicePort ?? 35222,
                    ocrPort: nextOcrPort ?? 35116,
                    readerPort: nextReaderPort ?? 35336,
                    aiPort: nextAiPort ?? 35226
                });
            }
        });

        timerWindow = new BrowserWindow({
            title: '计时服务',
            width: 600,
            height: 400,
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        fetchRecordWindow = new BrowserWindow({
            title: '采集消息',
            width: 600,
            height: 400,
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        mainWindow = new BrowserWindow({
            title: appName ?? '北京万盛华通科技有限公司',
            icon: config?.logo ? join(appPath, `../config/${config.logo}`) : undefined,
            width: config?.windowWidth ?? 1280, //主窗体宽
            height: config?.windowHeight ?? 900, //主窗体高
            autoHideMenuBar: true, //隐藏主窗口菜单
            center: config?.center ?? true, //居中显示
            minHeight: config?.minHeight ?? 900, //最小高度
            minWidth: config?.minWidth ?? 960, //最小宽度
            frame: false,//不使用原生标题栏
            thickFrame: true,
            backgroundColor: '#0f224d',
            webPreferences: {
                webSecurity: false,
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        if (isDev) {
            mainWindow.loadURL(config!.devPageUrl);
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.loadFile(join(resourcesPath, 'app.asar.unpacked/dist/renderer/default.html'));
        }

        mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow!.show();
            timerWindow!.loadFile(join(__dirname, './renderer/timer.html'));
            fetchRecordWindow!.loadFile(join(__dirname, './renderer/fetch-record.html'));
            if (isDev) {
                startupWindow!.loadFile(join(__dirname, './renderer/startup.html'));
                timerWindow!.webContents.openDevTools();
                fetchRecordWindow!.webContents.openDevTools();
                startupWindow!.webContents.openDevTools();
            } else {
                startupWindow!.loadFile(join(resourcesPath, 'app.asar.unpacked/dist/renderer/startup.html'));
            }
        });

        mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDesc) =>
            log.error(`渲染进程mainWindow加载页面失败(did-fail-load): 错误码:${errorCode}, 错误消息:${errorDesc}`)
        );

        mainWindow.on('close', event => {
            //关闭事件到mainWindow中去处理
            event.preventDefault();
            mainWindow!.webContents.send('will-close');
        });

        (async () => {
            if (mainWindow !== null) {
                try {
                    const httpPort = await helper.portStat(config!.httpPort ?? 9900);
                    //启动HTTP服务
                    server.use(api(mainWindow.webContents));
                    server.listen(httpPort, () => {
                        console.log(`HTTP服务启动在端口${httpPort}`);
                        log.info(`HTTP服务启动在端口${httpPort}`);
                    });
                } catch (error) {
                    log.error(`HTTP服务启动失败:${error.message}`);
                }
            }
        })();
    });
}

// ipcMain.on('startup', (_: IpcMainEvent, conf: Conf) => {
//     if (startupWindow) {
//         startupWindow.webContents.send('startup', conf);
//     }
// })

//退出应用
ipcMain.on('do-close', (_: IpcMainEvent) => {
    //mainWindow通知退出程序

    if (startupWindow) {
        startupWindow.webContents.send('closure');
    }

    exitApp(platform);
});

/**
 * 重启应用
 */
ipcMain.on('do-relaunch', () => {
    app.relaunch();
    exitApp(platform);
});

//最小化窗口
ipcMain.on('minimize', (_: IpcMainEvent) => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

//最大化窗口
ipcMain.on('maximize', (_: IpcMainEvent) => {
    if (mainWindow) {
        mainWindow.isMaximized()
            ? mainWindow.unmaximize()
            : mainWindow.maximize();
    }
});

ipcMain.on('theme', (_: IpcMainEvent, nextSkin) => {
    if (mainWindow) {
        mainWindow.webContents.send('theme', nextSkin);
    }
});

//加密狗提示
ipcMain.on('dog-warn', (_: IpcMainEvent) => {
    if (mainWindow) {
        mainWindow.webContents.send('dog-warn');
    }
});

//执行SQLite查询单位表
ipcMain.on('query-db', (_: IpcMainEvent, ...args) => {
    if (sqliteWindow === null) {
        sqliteWindow = new BrowserWindow({
            title: 'SQLite',
            width: 600,
            height: 400,
            show: false,
            webPreferences: {
                webSecurity: false,
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        sqliteWindow.loadFile(join(__dirname, './renderer/sqlite.html'));
        if (isDev) {
            sqliteWindow.webContents.openDevTools();
        }
        sqliteWindow.webContents.once('did-finish-load', () => sqliteWindow!.webContents.send('query-db', args));
    } else {
        sqliteWindow.webContents.send('query-db', args);
    }
});

//SQLite查询结果
ipcMain.on('query-db-result', (_: IpcMainEvent, result: Record<string, any>) => {
    mainWindow!.webContents.send('query-db-result', result);
    if (sqliteWindow !== null) {
        sqliteWindow.destroy();
        sqliteWindow = null;
    }
});

//显示阅读协议
ipcMain.on('show-protocol', (event: IpcMainEvent, fetchData: FetchData) => {
    event.preventDefault();
    if (protocolWindow === null) {
        protocolWindow = new BrowserWindow({
            width: 800,
            height: 350,
            show: true,
            frame: false,
            resizable: false,
            closable: false,
            alwaysOnTop: true,
            parent: mainWindow!,
            modal: true,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });
        if (isDev) {
            protocolWindow.loadFile(join(__dirname, './renderer/protocol.html'));
        } else {
            protocolWindow.loadFile(join(resourcesPath, 'app.asar.unpacked/dist/renderer/protocol.html'));
        }

        protocolWindow.webContents.on('did-finish-load', () =>
            protocolWindow!.webContents.send('show-protocol', fetchData)
        );
    } else {
        protocolWindow.show();
        protocolWindow.webContents.send('show-protocol', fetchData);
    }
});

//显示阅读协议
ipcMain.on('show-image-verify', (event: IpcMainEvent, url: string) => {
    event.preventDefault();
    if (imageVerifyWindow === null || imageVerifyWindow.isDestroyed()) {
        imageVerifyWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: true,
            frame: true,
            alwaysOnTop: true,
            parent: mainWindow!,
            modal: true,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });
        imageVerifyWindow.setMenu(null);
        imageVerifyWindow.loadURL(url);
    } else {
        imageVerifyWindow.show();
    }
});

//启动&停止计时
ipcMain.on('time', (_: IpcMainEvent, usb: number, isStart: boolean) => {
    if (timerWindow !== null) {
        timerWindow.webContents.send('time', usb, isStart);
    }
});
//向主窗口发送计时时间
ipcMain.on('receive-time', (_: IpcMainEvent, usb: number, timeString: string) => {
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('receive-time', usb, timeString);
    }
});
ipcMain.on('clock-1', (_: IpcMainEvent) => {
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('clock-1');
    }
});
ipcMain.on('clock-60', (_: IpcMainEvent) => {
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('clock-60');
    }
});
//向主窗口发送采集结束以停止计时
ipcMain.on('fetch-over', (_: IpcMainEvent, usb: number) => {
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('fetch-over', usb);
    }
});

//发送进度消息
ipcMain.on('fetch-progress', (_: IpcMainEvent, arg) => {
    fetchRecordWindow!.webContents.send('fetch-progress', arg);
    mainWindow!.webContents.send('fetch-progress', arg);
});
//采集完成发送USB号及日志数据
ipcMain.on('fetch-finish', (_: IpcMainEvent, usb: number, log: FetchLog) =>
    fetchRecordWindow!.webContents.send('fetch-finish', usb, log)
);
//清除USB序号对应的采集记录
ipcMain.on('progress-clear', (_: IpcMainEvent, usb: number) =>
    fetchRecordWindow!.webContents.send('progress-clear', usb)
);
//获取当前USB序号的采集进度数据
ipcMain.on('get-fetch-progress', (_: IpcMainEvent, usb: number) =>
    fetchRecordWindow!.webContents.send('get-fetch-progress', usb)
);
//获取当前USB序号最新一条进度消息
ipcMain.on('get-last-progress', (_: IpcMainEvent, usb: number) =>
    fetchRecordWindow!.webContents.send('get-last-progress', usb)
);
//消息发回LiveModal以显示采集进度
ipcMain.on('receive-fetch-progress', (_: IpcMainEvent, fetchRecords: FetchRecord[]) =>
    mainWindow!.webContents.send('receive-fetch-progress', fetchRecords)
);
//消息发回FetchInfo.tsx组件以显示最新一条进度
ipcMain.on('receive-fetch-last-progress', (_: IpcMainEvent, fetchRecord: FetchRecord) =>
    mainWindow!.webContents.send('receive-fetch-last-progress', fetchRecord)
);
//将FetchLog数据发送给入库
ipcMain.on('save-fetch-log', (_: IpcMainEvent, log: FetchRecord[]) => mainWindow!.webContents.send('save-fetch-log', log));

//阅读协议同意反馈
ipcMain.on('protocol-read', (_: IpcMainEvent, fetchData: FetchData, agree: boolean) => {
    mainWindow!.webContents.send('protocol-read', fetchData, agree);
    if (protocolWindow !== null) {
        protocolWindow.destroy();
        protocolWindow = null;
    }
});

//显示原生系统消息
ipcMain.on('show-notice', (_: IpcMainEvent, { title, message }) =>
    notifier.notify({
        sound: true,
        type: 'info',
        title: title ?? '消息',
        message: message ?? '有消息反馈请查阅'
    })
);

//显示notification消息,参数为消息文本
ipcMain.on('show-notification', (_, args) =>
    mainWindow!.webContents.send('show-notification', args)
);

//显示窗口进度
ipcMain.on('show-progress', (_, show: boolean) => {
    if (mainWindow !== null) {
        mainWindow.setProgressBar(show ? 1 : 0, {
            mode: show ? 'indeterminate' : 'none'
        });
    }
});

//导出报告
ipcMain.on('report-export', (_: IpcMainEvent, exportCondition: ExportCondition, treeParams: TreeParam, msgId: string) => {
    if (reportWindow === null) {
        reportWindow = new BrowserWindow({
            title: '报告导出',
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        reportWindow.loadFile(join(__dirname, './renderer/report.html'));
        if (isDev) {
            reportWindow.webContents.openDevTools();
        }
        reportWindow.webContents.once('did-finish-load', () => {
            if (reportWindow !== null) {
                reportWindow.webContents.send('report-export', exportCondition, treeParams, msgId);
            }
        });
    } else {
        reportWindow.webContents.send('report-export', exportCondition, treeParams, msgId);
    }
});

//导出报告（批量）
ipcMain.on('report-batch-export', (_: IpcMainEvent,
    batchExportTasks: BatchExportTask[], isAttach: boolean, isZip: boolean, msgId: string) => {
    if (reportWindow === null) {
        reportWindow = new BrowserWindow({
            title: '报告导出',
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });
        reportWindow.loadFile(join(__dirname, './renderer/report.html'));
        reportWindow.webContents.openDevTools();
        reportWindow.webContents.once('did-finish-load', () => {
            if (reportWindow !== null) {
                reportWindow.webContents.send(
                    'report-batch-export',
                    batchExportTasks,
                    isAttach,
                    isZip,
                    msgId
                );
            }
        });
    } else {
        reportWindow.webContents.send(
            'report-batch-export',
            batchExportTasks,
            isAttach,
            isZip,
            msgId
        );
    }
});

ipcMain.on('update-export-msg', (_, args) => {
    if (mainWindow !== null) {
        mainWindow.webContents.send('update-export-msg', args)
    }
});

//导出报告完成
ipcMain.on('report-export-finish', (_: IpcMainEvent,
    success: boolean, exportCondition: ExportCondition, isBatch: boolean, msgId: string) => {
    if (reportWindow !== null) {
        reportWindow.destroy();
        reportWindow = null;
    }
    shell.beep();
    if (mainWindow !== null) {
        mainWindow.setProgressBar(0, {
            mode: 'none'
        });
        mainWindow.webContents.send('report-export-finish', success, exportCondition, isBatch, msgId);
    }
});

//关闭导出报告
ipcMain.on('report-export-close', (event: IpcMainEvent) => {
    event.preventDefault();
    mainWindow!.setProgressBar(0);
    if (reportWindow !== null) {
        reportWindow.destroy();
        reportWindow = null;
    }
});

//打开开发者工具
ipcMain.on('dev-tool', () => {
    if (mainWindow !== null) {
        mainWindow.webContents.openDevTools();
    }
});

ipcMain.handle('open-dialog', (_, options) => dialog.showOpenDialog(options));

ipcMain.handle('get-path', (_, type: "home" | "appData" | "userData" |
    "sessionData" | "temp" | "exe" | "module" | "desktop" | "documents" |
    "downloads" | "music" | "pictures" | "videos" | "recent" | "logs" | "crashDumps") =>
    app.getPath(type)
);

ipcMain.handle('get-sys-path', (_) => ({
    "home": app.getPath("home"),
    "temp": app.getPath("temp"),
    "documents": app.getPath("documents"),
    "downloads": app.getPath("downloads"),
    "music": app.getPath("music"),
    "pictures": app.getPath("pictures"),
    "videos": app.getPath("videos"),
}));