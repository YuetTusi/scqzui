import { CheckJson } from "@/schema/check-json";

interface CheckModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 数据
     */
    data: CheckJson | null,
    /**
     * 保存handle
     */
    saveHandle: (data: CheckJson) => void,
    /**
     * 取消handle
     */
    cancelHandle: () => void
};

interface FormValue {
    /**
     * IP地址
     */
    ip: string,
    /**
     * 端口
     */
    port: number,
    /**
     * 用户名
     */
    username: string,
    /**
     * 口令
     */
    password: string,
    /**
     * 上传服务器目录
     */
    serverPath: string
}

export { CheckModalProp, FormValue }