import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import Tabs from 'antd/lib/tabs';
import { helper } from '@/utils/helper';
import { EmptyBox, InstallList } from './styled/style';
import { List } from './list';
import { AppNameDesc } from './app-name-desc';
import { ChangeDesc } from './change-desc';
import { UninstallDesc } from './uninstall-desc';
import { AppStatusChart } from './app-status-chart';
import { AppCategoryChart } from './app-category-chart';
import { UninstallCategoryChart } from './uninstall-category-chart';
import { InstallTabProp } from './prop';

const { TabPane } = Tabs;

/**
 * 选项卡组件
 */
const InstallTab: FC<InstallTabProp> = ({ installData }) => {
    const renderTab = () => {
        if (installData === null) {
            return <EmptyBox>
                <Empty description="暂无云点验数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>;
        } else {
            return <Tabs size="small">
                <TabPane tab="最近活跃时间" key="T1">
                    <InstallList>
                        <List
                            list={
                                helper.isNullOrUndefined(installData.lastActiveTime30List)
                                    ? []
                                    : installData.lastActiveTime30List.split(',')
                            }
                        />
                    </InstallList>
                </TabPane>
                <TabPane tab="30天内活跃天数" key="T2">
                    <InstallList>
                        <List
                            list={
                                helper.isNullOrUndefined(installData.activeDay30List)
                                    ? []
                                    : installData.activeDay30List.split(',')
                            }
                        />
                    </InstallList>
                </TabPane>
                <TabPane tab="在装应用及包名" key="T3">
                    <InstallList>
                        <AppNameDesc data={installData} />
                    </InstallList>
                </TabPane>
                <TabPane tab="在装应用及包名统计" key="T4">
                    <AppCategoryChart data={installData} />
                </TabPane>
                <TabPane tab="应用变化信息" key="T5">
                    <InstallList>
                        <ChangeDesc data={installData} />
                    </InstallList>
                </TabPane>
                <TabPane tab="变化统计" key="T6">
                    <AppStatusChart data={installData} />
                </TabPane>
                <TabPane tab="近半年卸载App" key="T7">
                    <InstallList>
                        <UninstallDesc data={installData} />
                    </InstallList>
                </TabPane>
                <TabPane tab="卸载统计" key="T8">
                    <UninstallCategoryChart data={installData} />
                </TabPane>
            </Tabs>;
        }
    };

    return renderTab();
};

export default InstallTab;
