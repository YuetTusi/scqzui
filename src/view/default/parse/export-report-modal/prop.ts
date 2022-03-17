import { DeviceType } from "@/schema/device-type";
import { ITreeNode } from "@/type/ztree";

/**
 * 组件属性
 */
interface ExportReportModalProp {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * 设备数据
     */
    data?: DeviceType,
    /**
     * 关闭handle
     */
    closeHandle?: () => void
}

interface CompleteMsgProp {
    /**
     * 完成消息
     */
    fileName: string;
    /**
     * 保存目录
     */
    savePath: string;
    /**
     * 打开目录handle
     */
    openHandle: (savePath: string) => void;
}

/**
 * zTree树结点数据
 */
interface ZTreeNode extends ITreeNode {
    /**
     * 图标
     */
    _icon?: string,
    /**
     * 数据文件路径
     */
    path: string,
    /**
     * 显示类型
     */
    type: string,
    /**
     * 页数
     */
    page?: number,
    /**
     * 附件清单文件
     */
    attach?: string
}

export { ExportReportModalProp, CompleteMsgProp, ZTreeNode };