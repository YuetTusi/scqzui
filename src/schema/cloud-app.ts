import { BaseApp } from './base-app';

enum TimeRange {
    /**
     * 全部
     */
    All,
    /**
     * 近一个月
     */
    OneMonthAgo,
    /**
     * 近三个月
     */
    ThreeMonthsAgo,
    /**
     * 近六个月
     */
    SixMonthsAgo
}



interface FetchOption {

    /**
     * 时段
     */
    timeRange: TimeRange,
    /**
     * 起始时间
     */
    startTime: Date,
    /**
     * 结束时间
     */
    endTime: Date,
    /**
     * 二维码
     */
    qrcode: string,
    /**
     * 取证中
     */
    fetching: boolean,

    item1: boolean,
    item2: boolean,
    item3: boolean,
    item4: boolean,
    item5: boolean,
    item6: boolean,
    item7: boolean,
    item8: boolean,
    item9: boolean,
    item10: boolean,
    item11: boolean,
    item12: boolean,
};

/**
 * 短信云取应用APP
 */
class CloudApp extends BaseApp {
    /**
     * 应用名称
     */
    public name: string;
    /**
     * 云取证应用Key值
     */
    public key: string;
    /**
     * 配置项
     */
    public ext?: { name: string, value: string }[];
    /**
     * 云取选项
     */
    public option: FetchOption;
    /**
     * 二维码图片
     */
    public qrcode: string;

    constructor(props: any = {}) {
        super(props);
        this.name = props.name ?? '';
        this.key = props.key ?? '';
        this.qrcode = props.qrcode ?? '';
        this.ext = props.ext ?? [];
        this.option = props.option ?? {};
        this.qrcode = props.qrcode ?? '';
    }
}

export { CloudApp, FetchOption, TimeRange };