import React, { FC, lazy, Suspense } from 'react';
import { RouterAPI } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import localeCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/lib/config-provider';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/styled/global-style';
import NotFound from '@/component/not-found/not-found';
import { LoadView } from '@/component/loading';
import BoardPanel from '@/component/board-panel';
import LayoutPanel from '@/component/layout-panel/layout-panel';
import theme from '../../../theme/cyan.json';


/**
 * 路由配置
 * @param api 路由参数
 * @returns 路由
 */
const createRouter = (api?: RouterAPI) => {
	const { history } = api!;

	return (
		<ConfigProvider
			locale={localeCN}
			autoInsertSpaceInButton={false}
			componentSize="middle">
			<ThemeProvider theme={theme}>
				<Router history={history}>
					<Switch>
						<Route
							path="/"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/guide')
								);
								return (
									<Suspense fallback={<LoadView />}>
										<BoardPanel>
											<Next />
										</BoardPanel>
									</Suspense>
								);
							}}
						/>
						<Route
							path="/collect"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/collect')
								);
								return (
									<Suspense fallback={<LoadView />}>
										<LayoutPanel>
											<Next />
										</LayoutPanel>
									</Suspense>
								);
							}}
						/>
						<Route
							path="/case-data"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-data')
								);
								return (
									<Suspense fallback={<LoadView />}>
										<LayoutPanel>
											<Next />
										</LayoutPanel>
									</Suspense>
								);
							}}
						/>
						<Route
							path="/case-data/add"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-add')
								);
								return (
									<Suspense fallback={<LoadView />}>
										<LayoutPanel>
											<Next />
										</LayoutPanel>
									</Suspense>
								);
							}}
						/>
						<Route
							path="/case-data/edit/:id"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/case/case-edit')
								);
								return (
									<Suspense fallback={<LoadView />}>
										<LayoutPanel>
											<Next />
										</LayoutPanel>
									</Suspense>
								);
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
									() => import('@/view/default/settings/index')
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
									() => import('@/view/default/log/index')
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
			</ThemeProvider>
			<GlobalStyle />
		</ConfigProvider>
	);
};

export { createRouter };
