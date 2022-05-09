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
	[modelName: string]: any
}

/**
 * ui.yaml配置
 */
interface Conf {
	/**
	 * 采集路数
	 */
	max: number;
	/**
	 * 是否启用标准取证
	 */
	useFetch: boolean;
	/**
	 * 是否启用云取证
	 */
	useServerCloud: boolean;
	/**
	 * 是否启用BCP
	 */
	useBcp: boolean;
	/**
	 * 是否启用工具箱
	 */
	useToolBox: boolean;
	/**
	 * 是否显示工具箱假按钮
	 */
	useFakeButton: boolean;
	/**
	 * 是否启用AI分析
	 */
	useAi: boolean;
	/**
	 * 是否启用痕迹查询登录
	 */
	useTraceLogin: boolean;
	/**
	 * 案件文案（默认`案件`）
	 */
	caseText: string;
	/**
	 * 采集文案（默认`取证`）
	 */
	fetchText: string;
	/**
	 * 设备文案（默认`设备`）
	 */
	devText: string;
	/**
	 * 解析文案（默认`解析`）
	 */
	parseText: string;
	/**
	 * 云取应用HTTP接口地址
	 */
	cloudAppUrl: string;
	/**
	 * 云取应用MD5验证接口地址
	 */
	cloudAppMd5: string;
	/**
	 * 是否启用硬件加速
	 */
	useHardwareAcceleration: boolean;
	/**
	 * 应用LOGO文件名
	 */
	logo: string;
	/**
	 * 窗口高度
	 */
	windowHeight: number;
	/**
	 * 窗口宽度
	 */
	windowWidth: number;
	/**
	 * 最小高度
	 */
	minHeight: number;
	/**
	 * 最小宽度
	 */
	minWidth: number;
	/**
	 * 是否居中显示
	 */
	center: boolean;
	/**
	 * TCP端口
	 */
	tcpPort: number;
	/**
	 * HTTP端口
	 */
	httpPort: number;
	/**
	 * 采集程序路径
	 */
	fetchPath: string;
	/**
	 * 采集程序名称
	 */
	fetchExe: string;
	/**
	 * 解析程序路径
	 */
	parsePath: string;
	/**
	 * 解析程序名称
	 */
	parseExe: string;
	/**
	 * 日志路径
	 */
	logFile: string;
	/**
	 * 本地开发页面
	 */
	devPageUrl: string;
	/**
	 * 应用痕迹查询路径
	 */
	appQueryPath: string;
	/**
	 * 应用痕迹查询exe名称
	 */
	appQueryExe: string;
	/**
	 * 云取服务名称
	 */
	yqExe: string;
	/**
	 * 云取服务路径
	 */
	yqPath: string;
}

export { StateTree, Conf };
