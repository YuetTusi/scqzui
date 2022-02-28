import path from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import {
    app, BrowserWindow, dialog, ipcMain, globalShortcut, Menu,
    OpenDialogReturnValue, SaveDialogReturnValue
} from 'electron';
import { WindowsBalloon } from 'node-notifier';
import log from './src/utils/log';
import { helper } from './src/utils/helper';
import { Conf } from './src/type/model';

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

        mainWindow = new BrowserWindow({
            title: appName ?? '北京万盛华通科技有限公司',
            icon: config?.logo ? path.join(appPath, `../config/${config.logo}`) : undefined,
            width: config?.windowWidth ?? 1280, //主窗体宽
            height: config?.windowHeight ?? 800, //主窗体高
            autoHideMenuBar: true, //隐藏主窗口菜单
            center: config?.center ?? true, //居中显示
            minHeight: config?.minHeight ?? 768, //最小高度
            minWidth: config?.minWidth ?? 960, //最小宽度
            backgroundColor: '#d3deef',
            webPreferences: {
                webSecurity: false,
                contextIsolation: false,
                nodeIntegration: true,
                javascript: true
            }
        });

        if (mode === 'development') {
            mainWindow.webContents.openDevTools();
            mainWindow.loadURL('http://localhost:8085/default.html');
        } else {
            if (config!.max <= 2) {
                //采集路数为2路以下，默认最大化窗口
                mainWindow.maximize();
            }
            mainWindow.loadFile(path.join(resourcesPath, 'app.asar.unpacked/dist/default.html'));
        }

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow!.show();
            // if (sqliteWindow) {
            //     sqliteWindow.loadFile(path.join(__dirname, './renderer/sqlite.html'));
            //     sqliteWindow.reload();
            // }
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
ipcMain.on('do-close', (event) => {
    //mainWindow通知退出程序
    exitApp(process.platform);
});

//执行SQLite查询单位表
ipcMain.on('query-db', (event, ...args) => {
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
        sqliteWindow.webContents.once('did-finish-load', () => sqliteWindow!.webContents.send('query-db', args));
    } else {
        sqliteWindow.webContents.send('query-db', args);
    }
});

//SQLite查询结果
ipcMain.on('query-db-result', (event, result) => {
    mainWindow!.webContents.send('query-db-result', result);
    if (sqliteWindow !== null) {
        sqliteWindow.destroy();
        sqliteWindow = null;
    }
});

//显示阅读协议
ipcMain.on('show-protocol', (event, fetchData) => {
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
        protocolWindow.loadFile(path.join(__dirname, './renderer/protocol.html'));
        protocolWindow.webContents.on('did-finish-load', () =>
            protocolWindow!.webContents.send('show-protocol', fetchData)
        );
    } else {
        protocolWindow.show();
        protocolWindow.webContents.send('show-protocol', fetchData);
    }
});

//阅读协议同意反馈
ipcMain.on('protocol-read', (event, fetchData, agree) => {
    mainWindow!.webContents.send('protocol-read', fetchData, agree);
    if (protocolWindow !== null) {
        protocolWindow.destroy();
        protocolWindow = null;
    }
});



//写net.json
ipcMain.handle('write-net-json', (event, servicePort: number) =>
    helper.writeNetJson(cwd, { apiPort: httpPort, servicePort })
);
