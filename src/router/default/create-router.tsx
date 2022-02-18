import React, { FC, lazy, Suspense } from 'react';
import { RouterAPI } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import localeCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/lib/config-provider';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/styled/global-style';

/**
 * 路由配置
 * @param api 路由参数
 * @returns 路由
 */
const createRouter = (api?: RouterAPI) => {
	const { history } = api!;

	return (
		<ConfigProvider locale={localeCN} componentSize="middle">
			<Router history={history}>
				<Switch>
					<Route
						path="/"
						exact={true}
						render={() => {
							const Next = lazy<FC<any>>(() => import('@/view/default/dashboard'));
							return (
								<Suspense fallback={<div>加载中</div>}>
									<Next />
								</Suspense>
							);
						}}
					/>
					<Route component={() => <h1>无此页面</h1>} />
				</Switch>
			</Router>
			<GlobalStyle />
		</ConfigProvider>
	);
};

export { createRouter };
