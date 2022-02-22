import React, { FC, lazy, Suspense } from 'react';
import { RouterAPI } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import localeCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/lib/config-provider';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/styled/global-style';
import BoardPanel from '@/component/board-panel';
import Dashboard from '@/view/default/dashboard';
import LayoutPanel from '@/component/layout-panel/layout-panel';


/**
 * 路由配置
 * @param api 路由参数
 * @returns 路由
 */
const createRouter = (api?: RouterAPI) => {
	const { history } = api!;

	return (
		<ConfigProvider locale={localeCN} componentSize="middle">
			<ThemeProvider theme={{}}>
				<Router history={history}>
					<Switch>
						<Route
							path="/"
							exact={true}
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/dashboard')
								);
								return (
									<Suspense fallback={<div>加载中</div>}>
										<BoardPanel>
											<Next />
										</BoardPanel>
									</Suspense>
								);
							}}
						/>
						<Route
							path="/settings"
							render={() => {
								const Next = lazy<FC<any>>(
									() => import('@/view/default/settings/index')
								);
								return <Suspense fallback={<div>加载中</div>}>
									<LayoutPanel>
										<Next />
									</LayoutPanel>
								</Suspense>;
							}}
						/>
						<Route component={() => <h1>无此页面</h1>} />
					</Switch>
				</Router>
			</ThemeProvider>
			<GlobalStyle />
		</ConfigProvider>
	);
};

export { createRouter };
