import Electron from 'electron';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'dva/router';
import { DeviceStoreState } from '@/model/default/device';
import { AppSetStore } from '@/model/default/app-set';

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
 * 经DvaConnect注入的组件
 */
interface StoreComponent<MatchParam = any> extends RouteComponentProps<MatchParam> {
	/**
	 * Dispatcher方法
	 */
	dispatch: Dispatch<any>;
}

/**
 * Redux状态树
 */
interface StateTree {
	appSet: AppSetStore,
	device: DeviceStoreState,
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

export { StoreComponent, StateTree, Conf };
