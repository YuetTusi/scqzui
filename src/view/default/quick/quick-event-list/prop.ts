import { QuickEvent } from "@/schema/quick-event";

export interface EventListProp {

    /**
     * 二维码点击handle
     */
    qrcodeHandle: (data: QuickEvent) => void;
    /**
     * 详情handle
     */
    detailHandle: (data: QuickEvent) => void;
};