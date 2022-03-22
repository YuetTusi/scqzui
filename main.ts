import path from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import {
    app, BrowserWindow, dialog, ipcMain, globalShortcut, Menu,
    OpenDialogReturnValue, SaveDialogReturnValue, shell, IpcMainEvent
} from 'electron';
import { WindowsBalloon } from 'node-notifier';
import log from './src/utils/log';
import { helper } from './src/utils/helper';
import { Conf } from './src/type/model';
import { BatchExportTask, ExportCondition, TreeParam } from '@/renderer/report/types';
import FetchLog from '@/schema/fetch-log';
import FetchRecord from '@/schema/fetch-record';
import FetchData from '@/schema/fetch-data';

const mode = process.env['NODE_ENV'];
const cwd = process.cwd();
const appPath = app.getAppPath();
const { resourcesPath } = process;

const appName = helper.readAppName();
let httpPort = 9900;
let config: Conf | null = null;
let useHardwareAcceleration = false; //是否使用硬件加速
let existManuJson = false;
let mainWindow: BrowserWindow | null = null;
let timerWindow: BrowserWindow | null = null; //计时
let sqliteWindow: BrowserWindow | null = null; //SQLite查询
let fetchRecordWindow: BrowserWindow | null = null; //采集记录
let reportWindow: BrowserWindow | null = null; //报告
let protocolWindow: BrowserWindow | null = null; //协议阅读
let fetchProcess: ChildProcessWithoutNullStreams | null = null; //采集进程
let parseProcess: ChildProcessWithoutNullStreams | null = null; //解析进程
let yunProcess: ChildProcessWithoutNullStreams | null = null; //云取服务进程
let appQueryProcess: ChildProcessWithoutNullStreams | null = null; //应用痕迹进程
let httpServerIsRunning = false; //是否已启动HttpServer

const notifier = new WindowsBalloon({
    withFallback: false,
    customPath: undefined
});

config = helper.readConf();
useHardwareAcceleration = config?.useHardwareAcceleration ?? !helper.isWin7();
existManuJson = helper.existManufaturer(mode!, appPath);
if (config === null) {
    dialog.showErrorBox('启动失败', '配置文件读取失败, 请联系技术支持');
    app.exit(0);
}
if (!existManuJson) {
    dialog.showErrorBox('启动失败', 'manufaturer配置读取失败, 请联系技术支持');
    app.exit(0);
}

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
    if (timerWindow !== null) {
        timerWindow.destroy();
        timerWindow = null;
    }
    if (fetchRecordWindow !== null) {
        fetchRecordWindow.destroy();
        fetchRecordWindow = null;
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
    // log.error(`Process UncaughtException: ${err.stack ?? ''}`);
    app.exit(1);
});

app.on('render-process-gone', (event, webContents, { exitCode, reason }) => {
    // log.error(`Render Process Gone: ${JSON.stringify({
    //     reason,
    //     exitCode,
    //     title: webContents.getTitle(),
    // })}`);
    switch (reason) {
        case 'crashed':
            webContents.getTitle();
            break;
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


const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
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

        (async () => {
            if (!httpServerIsRunning) {
                try {
                    httpPort = await helper.portStat(config!.httpPort ?? 9900);
                    //启动HTTP服务
                    // server.use(api(mainWindow.webContents));
                    // server.listen(httpPort, () => {
                    // 	httpServerIsRunning = true;
                    // 	console.log(`HTTP服务启动在端口${httpPort}`);
                    // });
                } catch (error) {
                    log.error(`HTTP服务启动失败:${error.message}`);
                }
            }
        })();

        timerWindow = new BrowserWindow({
            title: '计时服务',
            width: 600,
            height: 400,
            show: false,
            webPreferences: {
                // webSecurity: false,
                // allowRunningInsecureContent: true,
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
            icon: config?.logo ? path.join(appPath, `../config/${config.logo}`) : undefined,
            width: config?.windowWidth ?? 1280, //主窗体宽
            height: config?.windowHeight ?? 800, //主窗体高
            autoHideMenuBar: true, //隐藏主窗口菜单
            center: config?.center ?? true, //居中显示
            minHeight: config?.minHeight ?? 768, //最小高度
            minWidth: config?.minWidth ?? 960, //最小宽度
            frame: false,
            backgroundColor: '#181d30',
            webPreferences: {
                webSecurity: false,
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        if (mode === 'development') {
            mainWindow.loadURL('http://localhost:8085/default.html');
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.loadFile(path.join(resourcesPath, 'app.asar.unpacked/dist/renderer/default.html'));
        }

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow!.show();
            timerWindow!.loadFile(path.join(__dirname, './renderer/timer.html'));
            fetchRecordWindow!.loadFile(path.join(__dirname, './renderer/fetch-record.html'));
            if (mode === 'development') {
                timerWindow!.webContents.openDevTools();
                fetchRecordWindow!.webContents.openDevTools();
            }
        });

        mainWindow.webContents.addListener('new-window', (event) => event.preventDefault());

        mainWindow.on('close', (event) => {
            //关闭事件到mainWindow中去处理
            event.preventDefault();
            mainWindow!.webContents.send('will-close');
        });
    });
}

//启动后台服务（采集，解析，云取证）
ipcMain.on('run-service', () => {
    helper.runProc(
        fetchProcess,
        config?.fetchExe ?? 'n_fetch.exe',
        path.join(appPath, '../../../', config?.fetchPath ?? './n_fetch')
    );
    helper.runProc(
        parseProcess,
        config!.parseExe ?? 'parse.exe',
        path.join(appPath, '../../../', config?.parsePath ?? './parse')
    );
    if (config!.useServerCloud) {
        //有云取功能，调起云RPC服务
        helper.runProc(
            yunProcess,
            config!.yqExe ?? 'yqRPC.exe',
            path.join(appPath, '../../../', config?.yqPath ?? './yq'),
            ['-config', './agent.json', '-log_dir', './log']
        );
        // helper.runProc(
        //     yunProcess,
        //     config!.yqExe ?? 'yqRPC.exe',
        //     path.join('D:\\Electronic\\ElectronicForensics\\yq'),
        //     ['-config', './agent.json', '-log_dir', './log']
        // );
    }
    if (config!.useTraceLogin) {
        //有应用痕迹查询，调起服务
        helper.runProc(
            appQueryProcess,
            config?.appQueryExe ?? 'AppQuery.exe',
            path.join(appPath, '../../../', config?.appQueryPath ?? './AppQuery')
        );
    }
});


//退出应用
ipcMain.on('do-close', (event: IpcMainEvent) => {
    //mainWindow通知退出程序
    exitApp(process.platform);
});

//最小化窗口
ipcMain.on('minimize', (event: IpcMainEvent) => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

//最大化窗口
ipcMain.on('maximize', (event: IpcMainEvent) => {
    if (mainWindow) {
        mainWindow.isMaximized()
            ? mainWindow.unmaximize()
            : mainWindow.maximize();
    }
});

//执行SQLite查询单位表
ipcMain.on('query-db', (event: IpcMainEvent, ...args) => {
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

        sqliteWindow.loadFile(path.join(__dirname, './renderer/sqlite.html'));
        if (mode === 'development') {
            sqliteWindow.webContents.openDevTools();
        }
        sqliteWindow.webContents.once('did-finish-load', () => sqliteWindow!.webContents.send('query-db', args));
    } else {
        sqliteWindow.webContents.send('query-db', args);
    }
});

//SQLite查询结果
ipcMain.on('query-db-result', (event: IpcMainEvent, result: Record<string, any>) => {
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
        if (mode === 'development') {
            protocolWindow.loadFile(path.join(__dirname, './renderer/protocol.html'));
        } else {
            protocolWindow.loadFile(path.join(resourcesPath, 'app.asar.unpacked/dist/renderer/protocol.html'));
        }

        protocolWindow.webContents.on('did-finish-load', () =>
            protocolWindow!.webContents.send('show-protocol', fetchData)
        );
    } else {
        protocolWindow.show();
        protocolWindow.webContents.send('show-protocol', fetchData);
    }
});

//启动&停止计时
ipcMain.on('time', (event: IpcMainEvent, usb: number, isStart: boolean) => {
    if (timerWindow !== null) {
        timerWindow.webContents.send('time', usb, isStart);
    }
});
//向主窗口发送计时时间
ipcMain.on('receive-time', (event: IpcMainEvent, usb: number, timeString: string) => {
    // console.log(`${usb}:${timeString}`);
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('receive-time', usb, timeString);
    }
});
//向主窗口发送采集结束以停止计时
ipcMain.on('fetch-over', (event: IpcMainEvent, usb: number) => {
    if (mainWindow && mainWindow.webContents !== null) {
        mainWindow.webContents.send('fetch-over', usb);
    }
});

//发送进度消息
ipcMain.on('fetch-progress', (event: IpcMainEvent, arg) => {
    fetchRecordWindow!.webContents.send('fetch-progress', arg);
    mainWindow!.webContents.send('fetch-progress', arg);
});
//采集完成发送USB号及日志数据
ipcMain.on('fetch-finish', (event: IpcMainEvent, usb: number, log: FetchLog) =>
    fetchRecordWindow!.webContents.send('fetch-finish', usb, log)
);
//清除usb序号对应的采集记录
ipcMain.on('progress-clear', (event: IpcMainEvent, usb: number) =>
    fetchRecordWindow!.webContents.send('progress-clear', usb)
);
//获取当前USB序号的采集进度数据
ipcMain.on('get-fetch-progress', (event: IpcMainEvent, usb: number) => {
    fetchRecordWindow!.webContents.send('get-fetch-progress', usb);
});
//获取当前USB序号最新一条进度消息
ipcMain.on('get-last-progress', (event: IpcMainEvent, usb: number) =>
    fetchRecordWindow!.webContents.send('get-last-progress', usb)
);
//消息发回LiveModal以显示采集进度
ipcMain.on('receive-fetch-progress', (event: IpcMainEvent, fetchRecords: FetchRecord[]) =>
    mainWindow!.webContents.send('receive-fetch-progress', fetchRecords)
);
//消息发回FetchInfo.tsx组件以显示最新一条进度
ipcMain.on('receive-fetch-last-progress', (event: IpcMainEvent, fetchRecord: FetchRecord) =>
    mainWindow!.webContents.send('receive-fetch-last-progress', fetchRecord)
);
//将FetchLog数据发送给入库
ipcMain.on('save-fetch-log', (event: IpcMainEvent, log: FetchRecord[]) => mainWindow!.webContents.send('save-fetch-log', log));

//阅读协议同意反馈
ipcMain.on('protocol-read', (event: IpcMainEvent, fetchData: FetchData, agree: boolean) => {
    mainWindow!.webContents.send('protocol-read', fetchData, agree);
    if (protocolWindow !== null) {
        protocolWindow.destroy();
        protocolWindow = null;
    }
});

//显示原生系统消息
ipcMain.on('show-notice', (event: IpcMainEvent, { title, message }) =>
    notifier.notify({
        sound: true,
        type: 'info',
        title: title || '消息',
        message: message || '有消息反馈请查阅'
    })
);

//显示notification消息,参数为消息文本
ipcMain.on('show-notification', (event, args) => {
    mainWindow!.webContents.send('show-notification', args);
});

//显示窗口进度
ipcMain.on('show-progress', (event, show: boolean) => {
    if (mainWindow !== null) {
        mainWindow.setProgressBar(show ? 1 : 0, {
            mode: show ? 'indeterminate' : 'none'
        });
    }
});

//导出报告
ipcMain.on('report-export', (event: IpcMainEvent, exportCondition: ExportCondition, treeParams: TreeParam, msgId: string) => {
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

        reportWindow.loadFile(path.join(__dirname, './renderer/report.html'));
        if (mode === 'development') {
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
ipcMain.on('report-batch-export', (event: IpcMainEvent, batchExportTasks: BatchExportTask[], isAttach: boolean, isZip: boolean, msgId: string) => {
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
        reportWindow.loadFile(path.join(__dirname, './renderer/report.html'));
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

ipcMain.on('update-export-msg', (event, args) => {
    if (mainWindow !== null) {
        mainWindow.webContents.send('update-export-msg', args)
    }
});

//导出报告完成
ipcMain.on('report-export-finish', (event: IpcMainEvent, success: boolean, exportCondition: ExportCondition, isBatch: boolean, msgId: string) => {
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


//写net.json
ipcMain.handle('write-net-json', (event, servicePort: number) =>
    helper.writeNetJson(cwd, { apiPort: httpPort, servicePort })
);

ipcMain.handle('open-dialog', (event, options) => dialog.showOpenDialog(options));
