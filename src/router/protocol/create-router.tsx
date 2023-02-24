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
                                    () => import('@/view/protocol/reading')
                                );
                                return <Suspense fallback={<LoadView />}>
                                    <Next />
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
