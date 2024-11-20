import { resolve } from 'path';
import { createLogger, transports, format } from 'winston';

const { env, platform } = process;
const cwd = process.cwd();
const { combine, timestamp, printf } = format;

let loggerPath = null;

const formatLog = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}]: ${message}`;
});

if (env.NODE_ENV === 'development') {
    //NOTE: 开发
    loggerPath = resolve('.', './logs/log.txt');
} else if (platform === 'win32') {
    //NOTE: 生产
    loggerPath = resolve(cwd, './logs/log.txt');
} else {
    //NOTE: 生产
    loggerPath = resolve(cwd, '../logs/log.txt');
}

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        formatLog
    ),
    transports: [
        new transports.File({
            filename: loggerPath,
            maxsize: 524288
        })
    ]
});

export default logger;