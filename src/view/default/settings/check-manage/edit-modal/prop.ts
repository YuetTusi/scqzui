import FetchData from "@/schema/fetch-data"

interface EditModalProp {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 序列号
     */
    serial: string,
    /**
     * 保存handle
     */
    saveHandle: (data: FetchData) => void,
    /**
     * 取消handle
     */
    cancelHandle: () => void
};

export { EditModalProp }