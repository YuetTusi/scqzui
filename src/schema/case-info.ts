import { ParseApp } from './parse-app';
import { TokenApp } from './token-app';
import { BaseEntity } from './base-entity';
import { AttachmentType } from './bcp-entity';

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
     * 是否解析应用
     */
    public analysisApp: boolean;
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
     * 是否使用AI的OCR识别
     * 若此项为false，则为全局OCR识别
     */
    public useAiOcr: boolean;
    /**
     * 是否生成BCP
     */
    public generateBcp: boolean;
    /**
     * 是否有附件
     */
    public attachment: AttachmentType;
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
     * 是否开启AI分析
     */
    public isAi: boolean;
    /**
     * 是否开启图片违规分析
     */
    public isPhotoAnalysis: boolean;
    /**
     * 违规时段起
     */
    public ruleFrom: number;
    /**
     * 违规时段止
     */
    public ruleTo: number;

    constructor(props: any = {}) {
        super();
        this.m_strCaseName = props.m_strCaseName ?? '';
        this.spareName = props.spareName ?? '';
        this.m_strCasePath = props.m_strCasePath ?? '';
        this.analysisApp = props.analysisApp ?? true;
        this.sdCard = props.sdCard ?? false;
        this.hasReport = props.hasReport ?? false;
        this.m_bIsAutoParse = props.m_bIsAutoParse ?? false;
        this.useAiOcr = props.useAiOcr ?? false;
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
        this.isAi = props.isAi ?? false;
        this.isPhotoAnalysis = props.isPhotoAnalysis ?? false;
        this.ruleFrom = props.ruleFrom ?? 0;
        this.ruleTo = props.ruleTo ?? 8;
    }
}

export { CaseInfo };
export default CaseInfo;