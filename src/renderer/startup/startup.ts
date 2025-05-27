import { join } from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { ipcRenderer, IpcRendererEvent } from 'electron';
// import log from '@/utils/log';
import { Conf } from '@/type/model';
import { helper } from '@/utils/helper';

const cwd = process.cwd();
const { platform } = process;

let fetchProcess: ChildProcessWithoutNullStreams | null = null; //采集进程
let parseProcess: ChildProcessWithoutNullStreams | null = null; //解析进程
let yunProcess: ChildProcessWithoutNullStreams | null = null; //云取服务进程
let appQueryProcess: ChildProcessWithoutNullStreams | null = null; //应用痕迹进程
let quickFetchProcess: ChildProcessWithoutNullStreams | null = null; //快速点验进程
let imageOcrProcess: ChildProcessWithoutNullStreams | null = null; //OCR进程

ipcRenderer.on('startup', async (_: IpcRendererEvent, args: Conf) => {

    const {
        ocrPort,
        appQueryPath,
        useQuickFetch,
        useServerCloud,
        useTraceLogin
    } = args;

    const quickFetchDir = join(cwd, '../QuickFetch');

    helper.runFetch(
        fetchProcess,
        join(cwd, platform === 'linux' ? '../n_fetch/n_fetch' : '../n_fetch/n_fetch.exe'),
        join(cwd, '../n_fetch')
    );

    helper.runProc(
        parseProcess,
        join(cwd, platform === 'linux' ? '../parse/parse' : '../parse/parse.exe'),
        join(cwd, '../parse')
    );


    helper.runProcContinue(
        imageOcrProcess,
        platform === 'linux' ? 'ImageOcr' : 'ImageOcr.exe',
        join(cwd, '../tools/ImageOcr'),
        ['--listen_port', ocrPort?.toString() ?? '65116']
    );

    if (useQuickFetch) {
        //有快速点验功能，调起服务
        helper.runProc(
            quickFetchProcess,
            join(cwd, platform === 'linux' ? '../QuickFetch/QuickFetchServer' : '../QuickFetch/QuickFetchServer.exe'),
            quickFetchDir,
            [],
            {
                cwd: quickFetchDir,
                stdio: 'ignore'
            }
        );
    }
    if (useServerCloud) {
        //有云取功能，调起云RPC服务
        helper.runProc(
            yunProcess,
            join(cwd, platform === 'linux' ? '../yq/yqRPC' : '../yq/yqRPC.exe'),
            join(cwd, '../yq'),
            ['-config', './agent.json', '-log_dir', './log']
        );
    }
    if (useTraceLogin) {
        //有应用痕迹查询，调起服务
        helper.runProc(
            appQueryProcess,
            join(cwd, platform === 'linux' ? '../AppQuery/AppQuery' : '../AppQuery/AppQuery.exe'),
            join(cwd, appQueryPath ?? '../AppQuery')
        );
    }
});

ipcRenderer.on('closure', () => {

    if (fetchProcess !== null) {
        (fetchProcess as ChildProcessWithoutNullStreams).kill('SIGKILL');
        fetchProcess = null;
    }
    if (quickFetchProcess !== null) {
        (quickFetchProcess as ChildProcessWithoutNullStreams).kill('SIGKILL');	//杀掉快速点验进程
        quickFetchProcess = null;
    }
    if (fetchProcess !== null) {
        (fetchProcess as ChildProcessWithoutNullStreams).kill('SIGKILL');
        fetchProcess = null;
    }
    if (parseProcess !== null) {
        (parseProcess as ChildProcessWithoutNullStreams).kill('SIGKILL');
        parseProcess = null;
    }
    if (imageOcrProcess !== null) {
        (imageOcrProcess as ChildProcessWithoutNullStreams).kill('SIGKILL');
        imageOcrProcess = null;
    }
});