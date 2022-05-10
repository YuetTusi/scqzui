interface CrashProp { }

interface CrashState {
    /**
     * 是否捕获错误
     */
    hasError: boolean;
    /**
     * Error
     */
    err?: Error;
    /**
     * ErrorInfo
     */
    errInfo?: any;
}

export { CrashProp, CrashState };