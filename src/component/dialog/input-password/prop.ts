type OkHandle = (params: DatapassParam, forget: boolean, password?: string) => void;

/**
 * 导入手机输入密码时传回的参数
 */
interface DatapassParam {
    /**
     * 案件ID
     */
    caseId: string,
    /**
     * 手机ID
     */
    deviceId: string,
    /**
     * 手机名称
     */
    mobileName: string,
    /**
     * 错误消息
     */
    msg: string
};

export { DatapassParam, OkHandle };