import React, { FC } from 'react';
import BankOutlined from '@ant-design/icons/BankOutlined';
import { helper } from '@/utils/helper';
import { NavLink, Route } from 'dva/router';
import { MenuPanel } from './styled/menu';
import { SubLayout } from './styled/sub-layout';
import ContentBox from './content-box';
import Unit from '@/view/default/settings/unit';

const { max, useBcp, useTraceLogin } = helper.readConf()!;

/**
 * 设置布局页
 */
const Index: FC<{}> = () => <SubLayout>
    <MenuPanel>
        <div className="sub-title">
            软件设置
        </div>
        <ul>
            <li>
                <NavLink to="/settings" exact={true} replace={true} className="hvr-sweep-to-right">
                    <div>
                        <BankOutlined />
                        <span className="name">采集单位</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/settings/dst-unit" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <BankOutlined />
                        <span className="name">目的检验单位</span>
                    </div>
                </NavLink>
            </li>
        </ul>
    </MenuPanel>
    <Route
        path="/settings"
        exact={true}
        component={() => <ContentBox title="采集单位"><Unit /></ContentBox>} />
    <Route
        path="/settings/unit"
        component={() => <ContentBox title="采集单位"><Unit /></ContentBox>} />
    <Route
        path="/settings/dst-unit"
        component={() => <ContentBox title="目的检验单位"><div>目的检验单位</div></ContentBox>} />
</SubLayout>;

export default Index;
