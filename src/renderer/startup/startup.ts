import { join } from 'path';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { ipcRenderer, IpcRendererEvent } from 'electron';
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
let imageOcrProcess: any = null; //OCR进程
let readerProcess: any = null; //reader进程
let aiManagerProcess: any = null;//aiManager进程
let transferFileProcess: any = null;

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

ipcRenderer.on('closure', async () => {

    if (fetchProcess !== null) {
        try {
            await helper.kill(fetchProcess.pid!);
            log.info(`采集进程结束(pid:${fetchProcess.pid})`);
            fetchProcess = null;
        } catch (error) {
            log.error(`采集进程结束失败,${error.message}`);
        }
    }
    if (quickFetchProcess !== null) {
        try {
            await helper.kill(quickFetchProcess.pid!);
            log.info(`快速点验进程结束(pid:${quickFetchProcess.pid})`);
            quickFetchProcess = null;
        } catch (error) {
            log.error(`快速点验进程结束失败,${error.message}`);
        }
    }

    if (parseProcess !== null) {
        try {
            await helper.kill(parseProcess.pid!);
            log.info(`解析进程结束(pid:${parseProcess.pid})`);
            parseProcess = null;
        } catch (error) {
            log.error(`解析进程结束失败,${error.message}`);
        }
    }
    if (imageOcrProcess !== null) {
        try {
            (imageOcrProcess as any).stop();
            log.info(`ImageOcr进程结束  pid:${imageOcrProcess.pid}`);
            imageOcrProcess = null;
        } catch (error) {
            log.error(`ImageOcr结束失败,${error.message}`);
        }
    }
    if (aiManagerProcess !== null) {
        try {
            (aiManagerProcess as any).stop();
            log.info(`aimanager进程结束  pid:${aiManagerProcess.pid}`);
            aiManagerProcess = null;
        } catch (error) {
            log.error(`aimanager结束失败,${error.message}`);
        }
    }
    if (readerProcess !== null) {
        try {
            (readerProcess as any).stop();
            log.info(`reader进程结束 pid:${readerProcess.pid}`);
            readerProcess = null;
        } catch (error) {
            log.error(`reader结束失败,${error.message}`);
        }
    }
    if (transferFileProcess !== null) {
        try {
            (transferFileProcess as any).stop();
            log.info(`TransferFile进程结束 pid:${transferFileProcess.pid}`);
            transferFileProcess = null;
        } catch (error) {
            log.error(`TransferFile结束失败,${error.message}`);
        }
    }
    if (yunProcess !== null) {
        try {
            await helper.kill(yunProcess.pid!);
            log.info(`云取进程结束(pid:${yunProcess.pid})`);
            yunProcess = null;
        } catch (error) {
            log.error(`云取进程结束失败,${error.message}`);
        }
    }
    if (appQueryProcess !== null) {
        try {
            await helper.kill(appQueryProcess.pid!);
            log.info(`痕迹查询进程结束(pid:${appQueryProcess.pid})`);
            appQueryProcess = null;
        } catch (error) {
            log.error(`痕迹查询结束失败,${error.message}`);
        }
    }

    ipcRenderer.send('closed');
});