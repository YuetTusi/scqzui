import path from 'path';
import {
    app, BrowserWindow, dialog, ipcMain, globalShortcut, Menu,
    OpenDialogReturnValue, SaveDialogReturnValue
} from 'electron';

const mode = process.env['NODE_ENV'];
const cwd = process.cwd();
const { resourcesPath } = process;

let mainWindow: BrowserWindow | null = null;

/**
 * 销毁所有窗口
 */
function destroyAllWindow() {
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

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        title: '',
        width: 1280,
        height: 768,
        minWidth: 1280,
        minHeight: 768,
        backgroundColor: '#fff',
        autoHideMenuBar: true,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });



    mainWindow.webContents.addListener('new-window', (event) => event.preventDefault());
    mainWindow.webContents.on('did-finish-load', () => {
    });
    mainWindow.on('close', (event) => {
        //关闭事件到mainWindow中去处理
        event.preventDefault();
        // if (mainWindow !== null) {
        //     mainWindow.webContents.send('will-close');
        // }
        exitApp(process.platform);
    });

    if (mode === 'development') {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:8084/default.html');
    } else {
        mainWindow.loadFile(path.join(resourcesPath, 'app.asar.unpacked/dist/renderer/default.html'));
    }
    // #生产模式屏蔽快捷键（发布把注释放开）
    if (mode !== 'development') {
        // globalShortcut.register('Control+R', () => { });
        // globalShortcut.register('Control+Shift+R', () => { });
        // globalShortcut.register('CommandOrControl+Shift+I', () => { });
    }
    // mainWindow.removeMenu();
});

ipcMain.handle('get-path', (event, name: "home" |
    "desktop" | "documents" | "downloads" |
    "music" | "pictures" | "videos") => {
    return app.getPath(name);
});

ipcMain.handle('select-file', async (event, args) => {

    const val: OpenDialogReturnValue = await dialog
        .showOpenDialog({
            title: '选择txt文件',
            properties: ['openFile'],
            filters: [{ name: '文本文档', extensions: ['txt'] }]
        });

    return val;
});

ipcMain.handle('save-temp-file', async (event, args) => {
    const val: SaveDialogReturnValue = await dialog
        .showSaveDialog(mainWindow!, {
            title: '下载批量查询模板',
            properties: ['createDirectory'],
            defaultPath: cwd,
            filters: [{ name: '模板文件', extensions: ['txt'] }]
        });
    return val;
});

ipcMain.handle('select-dir', async (event, args) => {
    const val: OpenDialogReturnValue = await dialog.showOpenDialog(mainWindow!, {
        title: '请选择保存位置',
        properties: ['createDirectory', 'openDirectory'],
        defaultPath: cwd
    });
    return val;
});

//退出应用
ipcMain.on('do-close', (event) => {
    //mainWindow通知退出程序
    exitApp(process.platform);
});
