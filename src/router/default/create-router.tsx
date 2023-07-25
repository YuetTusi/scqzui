import React, { FC, lazy, Suspense } from 'react';
import { RouterAPI } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import Empty from 'antd/lib/empty';
import zhCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/lib/config-provider';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/styled/global-style';
import Crash from '@/component/crash';
import NotFound from '@/component/not-found';
import { LoadView } from '@/component/loading';
import BoardPanel, { LoginPanel } from '@/component/board-panel';
import LayoutPanel from '@/component/layout-panel/layout-panel';
import theme from '../../../theme/cyan.json';

/**
 * 路由配置
 * @param api 路由参数
 * @returns 路由
 */
const createRouter = (api?: RouterAPI) =>
	<ConfigProvider
		locale={zhCN}
		autoInsertSpaceInButton={false}
		renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
		componentSize="middle">
		<ThemeProvider theme={theme}>
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
		<GlobalStyle />
	</ConfigProvider>;

export { createRouter };
