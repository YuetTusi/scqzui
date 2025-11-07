import { join } from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import treeKill from 'tree-kill';
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
let readerProcess: ChildProcessWithoutNullStreams | null = null; //reader进程
let aiManagerProcess: ChildProcessWithoutNullStreams | null = null;//aiManager进程
let transferFileProcess: ChildProcessWithoutNullStreams | null = null;//aiManager进程

ipcRenderer.once('startup', async (_: IpcRendererEvent, args: Conf) => {

    const {
        ocrPort,
        appQueryPath,
        useQuickFetch,
        useServerCloud,
        useTraceLogin,
        transferFilePort
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
        join(cwd, '../tools/ai'),
        ['--listen_port', ocrPort.toString()]
    );

    helper.runProcContinue(
        readerProcess,
        platform === 'linux' ? 'reader' : 'reader.exe',
        join(cwd, '../tools/reader')
    );

    helper.runProcContinue(aiManagerProcess,
        platform === 'linux' ? 'aimanager' : 'aimanager.exe',
        join(cwd, '../tools/ai')
    );

    helper.runProcContinue(transferFileProcess,
        platform === 'linux' ? 'TransferFile' : 'TransferFile.exe',
        join(cwd, '../tools/TransferFile'),
        [transferFilePort.toString()]
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
        treeKill(fetchProcess.pid!, 'SIGKILL');
        fetchProcess.kill(-fetchProcess.pid!);
        fetchProcess = null;
    }
    if (quickFetchProcess !== null) {
        treeKill(quickFetchProcess.pid!, 'SIGKILL');
        // quickFetchProcess.kill(-quickFetchProcess.pid!);	//杀掉快速点验进程
        quickFetchProcess = null;
    }
    if (parseProcess !== null) {
        treeKill(parseProcess.pid!, 'SIGKILL');
        // parseProcess.kill(-parseProcess.pid!);
        parseProcess = null;
    }
    if (imageOcrProcess !== null) {
        treeKill(imageOcrProcess.pid!, 'SIGKILL');
        // imageOcrProcess.kill(-imageOcrProcess.pid!);
        imageOcrProcess = null;
    }
    if (readerProcess !== null) {
        treeKill(readerProcess.pid!, 'SIGKILL');
        // readerProcess.kill(-readerProcess.pid!);
        readerProcess = null;
    }
    if (transferFileProcess !== null) {
        treeKill(transferFileProcess.pid!, 'SIGKILL');
        // transferFileProcess.kill(-transferFileProcess.pid!);
        transferFileProcess = null;
    }
});