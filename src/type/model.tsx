import Electron from 'electron';
import { DeviceStoreState } from '@/model/default/device';
import { AppSetStore } from '@/model/default/app-set';
import { AlartMessageState } from '@/model/default/alart-message';
import { OperateDoingState } from '@/model/default/operate-doing';
import { CaseDataState } from '@/model/default/case-data';
import { CheckInputModalState } from '@/model/default/check-input-modal';
import { CloudCodeModalStoreState } from '@/model/default/cloud-code-modal';
import { OfficerState } from '@/model/default/officer';
import { CaseAddState } from '@/model/default/case-add';
import { CaseEditState } from '@/model/default/case-edit';
import { AiSwitchState } from '@/model/default/ai-switch';
import { Organization } from '@/schema/organization';
import { ParseCaseState } from '@/model/default/parse-case';
import { ParseDevState } from '@/model/default/parse-dev';
import { ParsingListState } from '@/model/default/parsing-list';
import { BatchExportReportModalState } from '@/model/default/batch-export-report-modal';
import { BcpHistoryState } from '@/model/default/bcp-history';
import { ExportBcpModalState } from '@/model/default/export-bcp-modal';
import { FetchLogTableState } from '@/model/default/fetch-log-table';
import { ParseLogTableState } from '@/model/default/parse-log-table';
import { CloudLogTableState } from '@/model/default/cloud-log-table';
import { CloudLogModalState } from '@/model/default/cloud-log-modal';
import { CheckManageTableState } from '@/model/default/check-manage-table';
import { TraceLoginState } from '@/model/default/trace-login';
import { TrailState } from '@/model/default/trail';
import { ImportDataModalState } from '@/model/default/import-data-modal';
import { CrackModalState } from '@/model/default/crack-modal';
import { QuickEventListState } from '@/model/default/quick-event-list';
import { EditQuickEventModalState } from '@/model/default/edit-quick-event-modal';
import { QuickRecordListState } from '@/model/default/quick-record-list';
import { CheckingListState } from '@/model/default/checking-list';
import { SelfUnitState } from '@/model/default/self-unit';
import { CloudState } from '@/model/default/cloud';
import { ApkModalState } from '@/model/default/apk-modal';
import { LoginState } from '@/model/default/login';
import { AndroidSetModalState } from '@/model/default/android-set-modal';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { ExtractionState } from '@/model/default/extraction';

declare global {
	interface Window {
		require: (path: string) => any;
		__dirname: string;
		__filename: string;
		module: NodeModule;
		electron: typeof Electron; //Electron对象
	}
}

/**
 * Redux状态树
 */
interface StateTree {
	appSet: AppSetStore,
	alartMessage: AlartMessageState,
	operateDoing: OperateDoingState,
	device: DeviceStoreState,
	caseData: CaseDataState,
	caseAdd: CaseAddState,
	caseEdit: CaseEditState,
	aiSwitch: AiSwitchState,
	checkInputModal: CheckInputModalState,
	cloudCodeModal: CloudCodeModalStoreState,
	officer: OfficerState,
	organization: Organization,
	parseCase: ParseCaseState,
	parseDev: ParseDevState,
	parsingList: ParsingListState,
	batchExportReportModal: BatchExportReportModalState,
	bcpHistory: BcpHistoryState,
	exportBcpModal: ExportBcpModalState,
	fetchLogTable: FetchLogTableState,
	parseLogTable: ParseLogTableState,
	checkManageTable: CheckManageTableState,
	cloudLogTable: CloudLogTableState,
	cloudLogModal: CloudLogModalState,
	traceLogin: TraceLoginState,
	trail: TrailState,
	importDataModal: ImportDataModalState,
	crackModal: CrackModalState,
	quickEventList: QuickEventListState,
	editQuickEventModal: EditQuickEventModalState,
	quickRecordList: QuickRecordListState,
	checkingList: CheckingListState,
	selfUnit: SelfUnitState,
	cloud: CloudState,
	apkModal: ApkModalState,
	login: LoginState,
	androidSetModal: AndroidSetModalState,
	paperworkModal: PaperworkModalState,
	extraction: ExtractionState,
	[modelName: string]: any
}

/**
 * ui.yaml配置
 */
interface Conf {
	/**
	 * 采集路数
	 */
	max: number,
	/**
	 * 是否启用标准取证
	 */
	useFetch: boolean,
	/**
	 * 是否启用云取证
	 */
	useServerCloud: boolean,
	/**
	 * 是否启用BCP
	 */
	useBcp: boolean,
	/**
	 * 是否启用工具箱
	 */
	useToolBox: boolean,
	/**
	 * 是否显示工具箱假按钮
	 */
	useFakeButton: boolean,
	/**
	 * 是否启用AI分析
	 */
	useAi: boolean,
	/**
	 * 是否启用登录
	 */
	useLogin: boolean,
	/**
	 * 是否启用痕迹查询登录
	 */
	useTraceLogin: boolean,
	/**
	 * 是否启用快速点验
	 */
	useQuickFetch: boolean,
	/**
	 * 是否启用App云取探测
	 */
	useCloudSearch: boolean,
	/**
	 * 是否启用网络行为查询
	 */
	useWebAction: boolean,
	/**
	 * 是否隐藏报告CAD节点
	 */
	hideCad: boolean,
	/**
	 * 案件文案（默认`案件`）
	 */
	caseText: string,
	/**
	 * 采集文案（默认`取证`）
	 */
	fetchText: string,
	/**
	 * 设备文案（默认`设备`）
	 */
	devText: string,
	/**
	 * 解析文案（默认`解析`）
	 */
	parseText: string,
	/**
	 * 取证按钮文案（默认`取证`）
	 */
	fetchButtonText: string,
	/**
	 * 云取证按钮文案（默认`云取证`）
	 */
	cloudButtonText: string,
	/**
	 * 云取应用HTTP接口地址
	 */
	cloudAppUrl: string,
	/**
	 * 云取应用MD5验证接口地址
	 */
	cloudAppMd5: string,
	/**
	 * 应用LOGO文件名
	 */
	logo: string,
	/**
	 * 窗口高度
	 */
	windowHeight: number,
	/**
	 * 窗口宽度
	 */
	windowWidth: number,
	/**
	 * 最小高度
	 */
	minHeight: number,
	/**
	 * 最小宽度
	 */
	minWidth: number,
	/**
	 * 是否居中显示
	 */
	center: boolean,
	/**
	 * TCP端口
	 */
	tcpPort: number,
	/**
	 * HTTP端口
	 */
	httpPort: number,
	/**
	 * OCR端口
	 */
	ocrPort: number,
	/**
	 * 采集程序路径
	 */
	fetchPath: string,
	/**
	 * 采集程序名称
	 */
	fetchExe: string,
	/**
	 * 解析程序路径
	 */
	parsePath: string,
	/**
	 * 解析程序名称
	 */
	parseExe: string,
	/**
	 * 日志路径
	 */
	logFile: string,
	/**
	 * 本地开发页面
	 */
	devPageUrl: string,
	/**
	 * 应用痕迹查询路径
	 */
	appQueryPath: string,
	/**
	 * 应用痕迹查询exe名称
	 */
	appQueryExe: string,
	/**
	 * 云取服务名称
	 */
	yqExe: string,
	/**
	 * 云取服务路径
	 */
	yqPath: string,
	/**
	 * 快速点验服务路径
	 */
	quickFetchPath: string,
	/**
	 * 快速点验服务名称
	 */
	quickFetchExe: string,
	/**
	 * 报告显示方式
	 */
	reportType: number,
	/**
	 * 报告隐藏违规App
	 */
	reportHideApp: number
}

export { StateTree, Conf };
