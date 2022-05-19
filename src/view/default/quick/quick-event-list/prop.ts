import { QuickEvent } from "@/schema/quick-event";

export interface EventListProp {

    /**
     * 详情handle
     */
    detailHandle: (data: QuickEvent) => void;
};