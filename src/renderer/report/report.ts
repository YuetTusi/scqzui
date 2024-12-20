
import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { stat } from 'fs/promises';
import { basename, join } from 'path';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mapLimit } from 'async';
import groupBy from 'lodash/groupBy';
import archiver from 'archiver';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import {
    BatchExportTask,
    CopyParam,
    ExportCondition,
    TreeParam
} from './types';
import {
    mkdir,
    copy,
    copyFiles,
    readJSONFile,
    writeJSONfile,
    updateFileTime
} from './helper';

/**
 * 接收main.js导出消息
 */
ipcRenderer.on('report-export', async (
    _: IpcRendererEvent,
    exportCondition: ExportCondition,
    treeParams: TreeParam,
    msgId: string
) => {
    const { isZip } = exportCondition;

    try {
        if (isZip) {
            await compressReport(exportCondition, treeParams);
            await calcHash(exportCondition);
        } else {
            await copyReport(exportCondition, treeParams);
        }
        ipcRenderer.send('report-export-finish', true, exportCondition, false, msgId);
    } catch (error) {
        console.error(error);
        log.error(`导出报告错误: ${error.message}`);
        ipcRenderer.send('report-export-finish', false, exportCondition, false, msgId);
    }
});

/**
 * 接收main.js批量导出消息
 */
ipcRenderer.on('report-batch-export', async (
    _,
    batchExportTasks: BatchExportTask[],
    isAttach: boolean,
    isZip: boolean,
    msgId: string
) => {
    try {
        for (let i = 0, l = batchExportTasks.length; i < l; i++) {
            const { reportRoot, saveTarget, reportName, tree, files, attaches } =
                batchExportTasks[i];

            ipcRenderer.send('update-export-msg', {
                id: msgId,
                msg: `正在导出(${i + 1}/${l})「${reportName}」`
            });
            if (isZip) {
                await compressReport(
                    { reportRoot, saveTarget, reportName, isAttach, isZip },
                    { tree, files, attaches }
                );
                await calcHash({ reportRoot, saveTarget, reportName, isAttach, isZip });
            } else {
                await copyReport(
                    { reportRoot, saveTarget, reportName, isAttach, isZip },
                    { tree, files, attaches }
                );
            }
        }

        ipcRenderer.send('report-export-finish', true, batchExportTasks, true, msgId);
    } catch (error) {
        log.error(`批量导出报告错误: ${error.message}`);
        ipcRenderer.send('report-export-finish', false, batchExportTasks, true, msgId);
    }
});

/**
 * 拷贝报告
 * @param {string} exportCondition.reportRoot 报告源路径
 * @param {string} exportCondition.saveTarget 导出路径
 * @param {string} exportCondition.reportName 导出名称
 * @param {boolean} exportCondition.isAttach 是否带附件
 * @param {boolean} exportCondition.isZip 是否压缩
 * @param {string} treeParams.tree tree.json文件内容
 * @param {string[]} treeParams.files 数据文件列表
 * @param {string[]} treeParams.attaches 附件文件列表
 */
async function copyReport(
    { reportRoot, saveTarget, reportName, isAttach }: ExportCondition,
    { tree, files, attaches }: TreeParam) {

    log.info(`${reportName} 导出报告至: ${saveTarget}`);

    //拷贝静态资源等必需的文件
    await Promise.allSettled([
        copyFiles(
            [
                'assert/**/*',
                'fonts/**/*',
                'public/default/**/*',
                'public/icons/**/*',
                'index.html',
                'preview.html',
                '*.js'
            ],
            join(saveTarget, reportName),
            {
                parents: true,
                cwd: reportRoot
            }
        )
    ]);

    await mkdir(join(saveTarget, reportName, 'public/data'));

    for (let i = 0, l = files.length; i < l; i++) {
        const jsonName = basename(files[i]);
        await copy(
            join(reportRoot, 'public/data', files[i]),
            join(saveTarget, reportName, 'public/data', jsonName)
        );
    }

    await writeJSONfile(
        join(saveTarget, reportName, 'public/data/tree.json'),
        `;var data=${JSON.stringify(tree)}`
    );

    if (isAttach) {
        const tick = new Date().getTime();
        await copyAttach(reportRoot, saveTarget, reportName, attaches);
        log.info(`耗时: ${new Date().getTime() - tick} ms`);
    }

    log.info(`${reportName} 导出结束`);
}

/**
 * 压缩报告
 * @param {string} exportCondition.reportRoot 报告源路径
 * @param {string} exportCondition.saveTarget 导出路径
 * @param {string} exportCondition.reportName 导出名称
 * @param {boolean} exportCondition.isAttach 是否带附件
 * @param {boolean} exportCondition.isZip 是否压缩
 * @param {string} treeParams.tree tree.json文件内容
 * @param {string[]} treeParams.files 数据文件列表
 * @param {string[]} treeParams.attaches 附件文件列表
 */
function compressReport(
    { reportRoot, saveTarget, reportName, isAttach }: ExportCondition,
    { tree, files, attaches }: TreeParam) {

    const archive = archiver('zip', {
        zlib: { level: 7 } //压缩级别
    });
    const ws = createWriteStream(join(saveTarget, `${reportName}.zip`));

    return new Promise((resolve, reject) => {
        archive.once('error', (err) => {
            console.log(err);
            log.error(`压缩文件出错 @compressReport(), 错误消息: ${err.message}`);
            reject(err);
        });
        archive.once('finish', () => resolve(void 0));
        archive.pipe(ws);
        //报告所需基本文件
        archive.glob(
            '{assert/**/*,fonts/**/*,public/default/**/*,public/icons/**/*,index.html,preview.html,*.js}',
            { cwd: reportRoot }
        );
        //用户所选数据JSON
        files.forEach(f =>
            archive.file(join(reportRoot, 'public/data', f), { name: `public/data/${f}` })
        );
        //筛选子树JSON
        archive.append(Buffer.from(`;var data=${JSON.stringify(tree)}`), {
            name: 'public/data/tree.json'
        });
        if (isAttach) {
            //TODO: 在此处理拷贝附件
            getAttachZipPath(reportRoot, attaches)
                .then((zipPaths: any[]) => {
                    //附件
                    zipPaths.forEach(({ from, to, rename }) =>
                        archive.file(from, { name: join(to, rename) })
                    );
                    //开始压缩
                    archive.finalize();
                })
                .catch((err) => {
                    archive.abort();
                    reject(err);
                });
        } else {
            //开始压缩
            archive.finalize();
        }
    });
}

/**
 * 并发执行拷贝附件任务
 * @param distination 保存到
 * @param folderName 目录名
 * @param copyList 附件列表
 * @param concurrent 并发数
 */
function copyTask(distination: string, folderName: string, copyList: CopyParam[], concurrent = 16) {
    return new Promise<string[]>((resolve, reject) => {
        mapLimit(copyList, concurrent,
            async ({ from, to, rename }: CopyParam) => {
                log.info(`Copy -> ${rename}`);
                const target = join(distination, folderName, to, rename); //拷贝到
                const [attachStat] = await Promise.all([stat(from), copy(from, target)]);
                await updateFileTime(target, attachStat.atime, attachStat.mtime);
                return target;
            },
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as string[]);
                }
            });
    });
}

/**
 * 拷贝附件
 * @param {string} source 报告源路径
 * @param {string} distination 目标路径
 * @param {string} folderName 导出文件夹名称
 * @param {string[]} attachFiles 附件JSON文件
 */
async function copyAttach(source: string, distination: string, folderName: string, attachFiles: string[]) {
    let copyPath: Array<CopyParam[]> = [];
    try {
        for (let i = 0, l = attachFiles.length; i < l; i++) {
            const attach = await readJSONFile(join(source, 'public/data', attachFiles[i]));
            copyPath = copyPath.concat([attach]);
        }
        const copyList = copyPath.flat();
        const grp = groupBy(copyList, 'to'); //分组
        log.info(`附件数量：${copyList.length}`);
        //创建附件目录
        await Promise.allSettled(
            Object.keys(grp).map((dir) => mkdir(join(distination, folderName, dir)))
        );
        await copyTask(distination, folderName, copyList);
    } catch (error) {
        log.error(`拷贝附件出错, 错误消息:${error.message}`);
        throw error;
    }
    // try {
    //     for (let i = 0, l = copyList.length; i < l; i++) {
    //         const { from, to, rename } = copyList[i];
    //         const target = join(distination, folderName, to, rename); //拷贝到
    //         if (extname(rename) === '.heic') {
    //             //转码HEIC图像
    //             const buf = await heicToJpeg(from);
    //             if (buf !== null) {
    //                 await writeFile(target, buf);
    //             }
    //         } else {
    //             const [attachStat] = await Promise.all([stat(from), copy(from, target)]);
    //             await updateFileTime(target, attachStat.atime, attachStat.mtime);
    //         }
    //     }
    //     console.log(`${folderName}拷贝附件结束,共:${copyList.length}个`);
    //     log.info(`${folderName}拷贝附件结束,共:${copyList.length}个`);
    // } catch (error) {

    // }
}

/**
 * 根据附件清单返回整个附件压缩路径
 * @param {string} source 源路径
 * @param {string[]} attachFiles 附件清单JSON文件
 * @returns {CopyTo[]} 压缩附件路径Array
 */
async function getAttachZipPath(source: string, attachFiles: string[]) {
    let copyPath: any[] = [];
    try {
        copyPath = await Promise.all(
            attachFiles.map((f) => {
                return readJSONFile(join(source, 'public/data', f));
            })
        );
        return copyPath.flat();
    } catch (error) {
        console.log(
            `读取附件清单失败 @view/record/Parse/ExportReportModal/getAttachZipPath: ${error.message}`
        );
        return [];
    }
}

/**
 * 计算报告压缩包哈希并写入文件
 */
async function calcHash({ saveTarget, reportName }: ExportCondition) {
    const reportFile = join(saveTarget, `${reportName}.zip`);
    const hashFile = join(saveTarget, `${reportName}.txt`);

    try {
        const [md5, sha1, sha256] = await Promise.all([
            helper.hashFile(reportFile, 'md5'),
            helper.hashFile(reportFile, 'sha1'),
            helper.hashFile(reportFile, 'sha256')
        ]);

        await writeFile(hashFile, `报告文件：${reportName}.zip\r\n─────────────────────────────────────────────────────────────────────────────────\r\nMD5:\t${md5}\r\nSHA1:\t${sha1}\r\nSHA256:\t${sha256}`);

    } catch (error) {
        log.error(`计算文件哈希值失败: ${error.message}`);
    }
}