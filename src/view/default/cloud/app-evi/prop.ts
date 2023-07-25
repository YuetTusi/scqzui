import { CloudApp } from "@/schema/cloud-app";

export interface AppEviProp {
    /**
     * 云取应用数据
     */
    app: CloudApp,
    /**
     * 删除云应用
     */
    onDelete: (app: CloudApp) => void
};