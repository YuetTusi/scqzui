import { join } from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import treeKill from 'tree-kill';
import { Conf } from '@/type/model';
import { helper } from '@/utils/helper';
import log from '@/utils/log';

const cwd = process.cwd();
const { platform } = process;

let fetchProcess: ChildProcessWithoutNullStreams | null = null; //采集进程
let parseProcess: ChildProcessWithoutNullStreams | null = null; //解析进程
let yunProcess: ChildProcessWithoutNullStreams | null = null; //云取服务进程
let appQueryProcess: ChildProcessWithoutNullStreams | null = null; //应用痕迹进程
let quickFetchProcess: ChildProcessWithoutNullStreams | null = null; //快速点验进程
let imageOcrProcess: ChildProcessWithoutNullStreams | undefined = undefined; //OCR进程
let readerProcess: ChildProcessWithoutNullStreams | undefined = undefined; //reader进程
let aiManagerProcess: ChildProcessWithoutNullStreams | undefined = undefined;//aiManager进程
let transferFileProcess: ChildProcessWithoutNullStreams | undefined = undefined;

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

    fetchProcess = helper.runService(
        join(cwd, platform === 'linux' ? '../n_fetch/n_fetch' : '../n_fetch/n_fetch.exe'),
        join(cwd, '../n_fetch')
    );

    parseProcess = helper.runService(
        join(cwd, platform === 'linux' ? '../parse/parse' : '../parse/parse.exe'),
        join(cwd, '../parse')
    );

    imageOcrProcess = helper.runProcContinue(
        platform === 'linux' ? 'ImageOcr' : 'ImageOcr.exe',
        join(cwd, '../tools/ai'),
        ['--listen_port', ocrPort.toString()]);

    readerProcess = helper.runProcContinue(
        platform === 'linux' ? 'reader' : 'reader.exe',
        join(cwd, '../tools/reader'));

    aiManagerProcess = helper.runProcContinue(
        platform === 'linux' ? 'aimanager' : 'aimanager.exe',
        join(cwd, '../tools/ai'));

    transferFileProcess = helper.runProcContinue(
        platform === 'linux' ? 'TransferFile' : 'TransferFile.exe',
        join(cwd, '../tools/TransferFile'),
        [transferFilePort.toString()]);

    if (useQuickFetch) {
        //有快速点验功能，调起服务
        quickFetchProcess = helper.runService(
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
        yunProcess = helper.runService(
            join(cwd, platform === 'linux' ? '../yq/yqRPC' : '../yq/yqRPC.exe'),
            join(cwd, '../yq'),
            ['-config', './agent.json', '-log_dir', './log']
        );
    }
    if (useTraceLogin) {
        //有应用痕迹查询，调起服务
        appQueryProcess = helper.runService(
            join(cwd, platform === 'linux' ? '../AppQuery/AppQuery' : '../AppQuery/AppQuery.exe'),
            join(cwd, appQueryPath ?? '../AppQuery')
        );
    }
});

ipcRenderer.on('closure', () => {

    if (fetchProcess !== null) {
        try {
            treeKill(fetchProcess.pid!, 'SIGKILL');
            log.info(`采集进程结束(pid:${fetchProcess.pid})`);
            fetchProcess = null;
        } catch (error) {
            log.info(`采集进程结束失败,${error.message}`);
        }
    }
    if (quickFetchProcess !== null) {
        try {
            treeKill(quickFetchProcess.pid!, 'SIGKILL');
            log.info(`快速点验进程结束(pid:${quickFetchProcess.pid})`);
            quickFetchProcess = null;
        } catch (error) {
            log.info(`快速点验进程结束失败,${error.message}`);
        }
    }

    if (parseProcess !== null) {
        try {
            treeKill(parseProcess.pid!, 'SIGKILL');
            log.info(`解析进程结束(pid:${parseProcess.pid})`);
            parseProcess = null;
        } catch (error) {
            log.info(`解析进程结束失败,${error.message}`);
        }
    }
    if (imageOcrProcess !== undefined) {
        treeKill(imageOcrProcess.pid!, 'SIGKILL');
        log.info(`ImageOcr进程结束  pid:${imageOcrProcess.pid}`);
        imageOcrProcess = undefined;
    }
    if (aiManagerProcess !== undefined) {
        treeKill(aiManagerProcess.pid!, 'SIGKILL');
        log.info(`aimanager进程结束  pid:${aiManagerProcess.pid}`);
        aiManagerProcess = undefined;
    }
    if (readerProcess !== undefined) {
        treeKill(readerProcess.pid!, 'SIGKILL');
        log.info(`reader进程结束 pid:${readerProcess.pid}`);
        readerProcess = undefined;
    }
    if (transferFileProcess !== undefined) {
        treeKill(transferFileProcess.pid!, 'SIGKILL');
        log.info(`TransferFile进程结束 pid:${transferFileProcess.pid}`);
        transferFileProcess = undefined;
    }
    if (yunProcess !== null) {
        treeKill(yunProcess.pid!, 'SIGKILL');
        log.info(`云取进程KILL(pid:${yunProcess.pid})`);
        yunProcess = null;
    }
    if (appQueryProcess !== null) {
        treeKill(appQueryProcess.pid!, 'SIGKILL');
        log.info(`痕迹查询进程KILL(pid:${appQueryProcess.pid})`);
        appQueryProcess = null;
    }

    ipcRenderer.send('closed');
});