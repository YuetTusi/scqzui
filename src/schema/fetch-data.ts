import { CloudApp } from "./cloud-app";
import { ParseApp } from "./parse-app";
import { DataMode } from "./data-mode";

/**
 * 采集对象
 */
class FetchData {
    /**
     * 案件名称
     */
    caseName?: string;
    /**
     * 案件备用名
     */
    spareName?: string;
    /**
     * 案件id
     */
    caseId?: string;
    /**
     * 案件存储路径（用户所选绝对路径）
     */
    casePath?: string;
    /**
     * 解析APP
     */
    appList?: ParseApp[];
    /**
     * 短信云取APP
     */
    cloudAppList?: CloudApp[];
    /**
     * 是否解析应用
     */
    analysisApp?: boolean;
    /**
     * 是否拉取SD卡
     */
    sdCard?: boolean;
    /**
     * 是否生成报告
     */
    hasReport?: boolean;
    /**
     * 是否自动解析
     */
    isAuto?: boolean;
    /**
     * 手机号
     */
    mobileNumber?: string;
    /**
     * 手机名称
     */
    mobileName?: string;
    /**
     * 手机编号
     */
    mobileNo?: string;
    /**
     * 手机持有人（点验版为`姓名`，共用此字段）
     */
    mobileHolder?: string;
    /**
     * 证件号码
     */
    credential?: string;
    /**
     * 检材持有人编号
     */
    handleOfficerNo?: string;
    /**
     * 备注（点验版为`设备手机号`，共用此字段）
     */
    note?: string;
    /**
     * 检验单位
     */
    unitName?: string;
    /**
     * 序列号
     */
    serial?: string;
    /**
     * 采集模式（0：标准,1：点验,2：广州警综平台,3：短信云取证）
     */
    mode?: DataMode;
    /**
     * 应用超时时间（云取）
     */
    cloudTimeout?: number;
    /**
     * 应用间隔时间（云取）
     */
    cloudTimespan?: number;
    /**
     * 是否保活
     */
    isAlive?: boolean;
    /**
     * 提取方式
     */
    extraction?: string
}

export { FetchData };
export default FetchData;