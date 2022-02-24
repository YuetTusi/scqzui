import { BaseApp } from './base-app';

/**
 * 解析APP
 */
class CParseApp extends BaseApp {
    /**
     * App包名列表
     */
    public m_strPktlist: string[];

    constructor(props: any = {}) {
        super(props);
        this.m_strPktlist = props.m_strPktlist ?? [];
    }
}

export { CParseApp };