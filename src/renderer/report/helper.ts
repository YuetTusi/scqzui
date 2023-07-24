import fs from 'fs';
import cpy from 'cpy';
// import convert from 'heic-convert';
import log from '@/utils/log';

/**
 * 创建目录
 * @param {string} dir 目录路径
 */
function mkdir(dir: string) {
    return new Promise<undefined>((resolve, reject) => {
        fs.mkdir(dir, { recursive: true }, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(void 0);
            }
        });
    });
}

/**
 * 拷贝文件
 * @param {string} from 源地址
 * @param {string} to 目的地址
 */
function copy(from: string, to: string) {
    let rs = fs.createReadStream(from);
    let ws = fs.createWriteStream(to);
    return new Promise<undefined>((resolve, reject) => {
        rs.pipe(ws);
        ws.once('error', (e: any) => {
            if (e.stack.includes('ENOSPC')) {
                //磁盘空间不足任务失败
                log.error(`拷贝失败, 磁盘空间不足:${e.message}`);
                reject(e);
            }
        });
        rs.once('error', (e: Error) => {
            log.error(`拷贝失败: ${e.message}`);
            resolve(undefined);
        });
        rs.once('end', () => {
            ws.close();
            rs.close();
            resolve(undefined);
        });
    });
}

/**
 * 批量拷贝文件
 * @param {string[]} fileList 文件列表
 * @param {string} destination 拷贝到
 * @param {object} options 配置项
 */
function copyFiles(fileList: string[], destination: string, options: Record<string, any>) {
    return cpy(fileList, destination, options);
}

/**
 * heic转码jpeg
 * @param heicPath heic图像路径
 */
// async function heicToJpeg(heicPath: string): Promise<Buffer | null> {
//     try {
//         const chunk = await readFile(heicPath);
//         const jpegBuf: Buffer = await convert({
//             buffer: chunk, // the HEIC file buffer
//             format: 'JPEG',      // output format
//             quality: 1           // the jpeg compression quality, between 0 and 1
//         });
//         return jpegBuf;
//     } catch (error) {
//         log.error(`HEIC转码失败(${heicPath})：${error.message}`);
//         return null;
//     }
// }

/**
 * 写入JSON文件，原文件会覆盖
 * @param filePath 文件路径
 * @param data JSON数据
 */
function writeJSONfile(filePath: string, data: any) {
    return new Promise((resolve, reject) => {
        let json = '';
        if (typeof data === 'string') {
            json = data;
        } else {
            try {
                json = JSON.stringify(data);
            } catch (error) {
                reject(error);
            }
        }
        fs.writeFile(filePath, json, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * 读取JSON文件
 * @param filePath 文件路径
 */
function readJSONFile<T = any>(filePath: string) {
    return new Promise<T>((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf8' }, (err: any, chunk: any) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(chunk));
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

/**
 * 更新目标文件的访问时间及修改时间
 */
function updateFileTime(filePath: string, atime: Date, mtime: Date) {
    return new Promise((resolve) => {
        fs.utimes(filePath, atime, mtime, (err: any) => {
            if (err) {
                console.warn(`修改文件时间失败:${filePath}`);
            }
            resolve(undefined);
        });
    });
}

export {
    mkdir,
    copy,
    copyFiles,
    // heicToJpeg,
    readJSONFile,
    writeJSONfile,
    updateFileTime
};
