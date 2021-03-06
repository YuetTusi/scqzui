import { ParseApp } from './parse-app';
import { TokenApp } from './token-app';
import { BaseEntity } from './base-entity';

/**
 * 案件（维护时）
 */
class CaseInfo extends BaseEntity {
    /**
     * 案件名称
     */
    public m_strCaseName: string;
    /**
     * 备用案件名
     * # 当此字段有数据，取此案件名为准（开放给用户一个可编辑案件名的功能）
     */
    public spareName: string;
    /**
     * 案件存储位置
     */
    public m_strCasePath: string;
    /**
     * 是否拉取SD卡
     */
    public sdCard: boolean;
    /**
     * 是否生成报告
     */
    public hasReport: boolean;
    /**
     * 是否自动解析
     */
    public m_bIsAutoParse: boolean;
    /**
     * 是否生成BCP
     */
    public generateBcp: boolean;
    /**
     * 是否有附件
     */
    public attachment: boolean;
    /**
     * 是否删除原数据
     */
    public isDel: boolean;
    /**
     * 解析App列表
     */
    public m_Applist: ParseApp[];
    /**
     * Token云取证App列表
     */
    public tokenAppList: TokenApp[];
    /**
     * 检验单位
     */
    public m_strCheckUnitName: string;
    /**
     * 采集人员编号(6位警号)
     */
    public officerNo: string;
    /**
     * 采集人员姓名
     */
    public officerName: string;
    /**
     * 网安部门案件编号
     */
    public securityCaseNo: string;
    /**
     * 网安部门案件类别
     */
    public securityCaseType: string;
    /**
     * 网安部门案件名称
     */
    public securityCaseName: string;
    /**
     * 执法办案系统案件编号
     */
    public handleCaseNo: string;
    /**
     * 执法办案系统案件类别
     */
    public handleCaseType: string;
    /**
     * 执法办案系统案件名称
     */
    public handleCaseName: string;
    /**
     * 执法办案人员编号/检材持有人编号
     */
    // public handleOfficerNo: string;
    /**
     * 是否开启AI分析
     */
    public isAi: boolean;
    /**
     * AI分析缩略图
     */
    public aiThumbnail: boolean;
    /**
     * AI武器类
     */
    public aiWeapon: boolean;
    /**
     * AI文档类
     */
    public aiDoc: boolean;
    /**
     * AI毒品类
     */
    public aiDrug: boolean;
    /**
     * AI裸体类
     */
    public aiNude: boolean;
    /**
     * AI货币类
     */
    public aiMoney: boolean;
    /**
     * AI着装类
     */
    public aiDress: boolean;
    /**
     * AI交通工具
     */
    public aiTransport: boolean;
    /**
     * AI证件类
     */
    public aiCredential: boolean;
    /**
     * AI聊天转帐类
     */
    public aiTransfer: boolean;
    /**
     * AI照片截图
     */
    public aiScreenshot: boolean;

    constructor(props: any = {}) {
        super();
        this.m_strCaseName = props.m_strCaseName ?? '';
        this.spareName = props.spareName ?? '';
        this.m_strCasePath = props.m_strCasePath ?? '';
        this.sdCard = props.sdCard ?? false;
        this.hasReport = props.hasReport ?? false;
        this.m_bIsAutoParse = props.m_bIsAutoParse ?? false;
        this.generateBcp = props.generateBcp ?? false;
        this.attachment = props.attachment ?? false;
        this.isDel = props.isDel ?? false;
        this.m_Applist = props.m_Applist ?? [];
        this.tokenAppList = props.tokenAppList ?? [];
        this.m_strCheckUnitName = props.m_strCheckUnitName ?? '';
        this.officerNo = props.officerNo ?? '';
        this.officerName = props.officerName ?? '';
        this.securityCaseNo = props.securityCaseNo ?? '';
        this.securityCaseType = props.securityCaseType ?? '';
        this.securityCaseName = props.securityCaseName ?? '';
        this.handleCaseNo = props.handleCaseNo ?? '';
        this.handleCaseType = props.handleCaseType ?? '';
        this.handleCaseName = props.handleCaseName ?? '';
        // this.handleOfficerNo = props.handleOfficerNo ?? '';
        this.isAi = props.isAi ?? false;
        this.aiThumbnail = props.aiThumbnail ?? false;
        this.aiWeapon = props.aiWeapon ?? false;
        this.aiDoc = props.aiDoc ?? false;
        this.aiDrug = props.aiDrug ?? false;
        this.aiNude = props.aiNude ?? false;
        this.aiMoney = props.aiMoney ?? false;
        this.aiDress = props.aiDress ?? false;
        this.aiTransport = props.aiTransport ?? false;
        this.aiCredential = props.aiCredential ?? false;
        this.aiTransfer = props.aiTransfer ?? false;
        this.aiScreenshot = props.aiScreenshot ?? false;
    }
}

export { CaseInfo };
export default CaseInfo;