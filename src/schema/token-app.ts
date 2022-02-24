import { BaseApp } from './base-app';

/**
 * Token云取APP
 */
class TokenApp extends BaseApp {
    /**
     * App包名列表
     */
    public m_strPktlist: string[];

    constructor(props: any = {}) {
        super(props);
        this.m_strPktlist = props.m_strPktlist ?? [];
    }
}

export { TokenApp };