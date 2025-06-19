import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { RouterAPI, useDispatch } from 'dva';
import { Router, Switch, Route } from 'dva/router';
import Empty from 'antd/lib/empty';
import zhCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/lib/config-provider';
import { ThemeProvider } from 'styled-components';
import { GlobalLightStyle, GlobalDarkStyle } from '@/styled';
import { useSubscribe } from '@/hook';
import { AppTheme } from '@/schema/theme';
import { helper } from '@/utils/helper';
import Crash from '@/component/crash';
import NotFound from '@/component/not-found';
import { LoadView } from '@/component/loading';
import BoardPanel, { LoginPanel } from '@/component/board-panel';
import LayoutPanel from '@/component/layout-panel/layout-panel';
import cyanDark from '../../theme/cyan.dark.json';
import cyanLight from '../../theme/cyan.light.json';

let $skin = document.querySelector<HTMLLinkElement>('#skin');

/**
 * 路由配置
 * @param api 路由参数
 * @returns 路由
 */
const createRouter = (api?: RouterAPI) => {

	// const dispatch = useDispatch();
	const [theme, setTheme] = useState<AppTheme>(AppTheme.CyanDark);

	useEffect(() => {
		if ($skin === null) {
			$skin = document.createElement('link');
			$skin.id = 'skin';
			$skin.rel = 'stylesheet';
			document.head.appendChild($skin);
		}
		const currentSkin = Number.parseInt(localStorage.getItem('theme') ?? '0') as AppTheme;
		setTheme(currentSkin);
		$skin.href = currentSkin === AppTheme.CyanDark ? './style/antd.dark.css' : './style/antd.css';
	}, []);

	useSubscribe('theme', (_, nextSkin: AppTheme) => {
		if ($skin === null) {
			return;
		}
		setTheme(nextSkin);
		$skin.href = nextSkin === AppTheme.CyanDark ? './style/antd.dark.css' : './style/antd.css';
		localStorage.setItem('theme', nextSkin.toString());
	});

	return <ConfigProvider
		locale={zhCN}
		autoInsertSpaceInButton={false}
		renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
		componentSize="middle">
		<ThemeProvider theme={theme === AppTheme.CyanDark ? cyanDark : cyanLight}>
			<Crash>
				<Router history={api!.history}>
					<Switch>
						<Route
							path="/"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/login')
								);
								return <Suspense fallback={<LoadView />}>
									<LoginPanel>
										<Next />
									</LoginPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/guide"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/guide')
								);
								return <Suspense fallback={<LoadView />}>
									<BoardPanel>
										<Next />
									</BoardPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/collect"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/collect')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/cloud"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/cloud')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/quick"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/quick')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/case-data"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-data')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/case-data/add"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-add')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/case-data/edit/:id"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-edit')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/parse"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/parse')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/bcp/:cid/:did"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/bcp')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/trail/:cid/:did"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/trail')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/settings"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/settings')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/log"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/log')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route
							path="/tool"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/tool')
								);
								return <Suspense fallback={<LoadView />}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route component={() => <LayoutPanel><NotFound /></LayoutPanel>} />
					</Switch>
				</Router>
			</Crash>
		</ThemeProvider>
		{theme === AppTheme.CyanDark ? <GlobalDarkStyle /> : <GlobalLightStyle />}
	</ConfigProvider>
};

export { createRouter };
