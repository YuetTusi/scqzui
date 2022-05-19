import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faArrowsRotate, faCloud } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Route } from 'dva/router';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import Reading from '@/component/loading/reading';
import AlartMessage from '@/component/alert-message';
import FetchLog from '@/view/default/log/fetch-log';
import ParseLog from '@/view/default/log/parse-log';
import CloudLog from '@/view/default/log/cloud-log';
import { MenuPanel } from './styled/menu';
import { LogLayout } from './styled/sub-layout';
import ContentBox from './content-box';

const { useFetch, useServerCloud, fetchText, parseText } = helper.readConf()!;

/**
 * 设置布局页
 */
const Index: FC<{}> = () => <LogLayout>
    <Reading />
    <AlartMessage />
    <MenuPanel>
        <div className="sub-title">
            操作日志
        </div>
        <ul>
            <li>
                <Auth deny={!useFetch && !useServerCloud}>
                    <NavLink to="/log" exact={true} replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faMobileScreenButton} /></span>
                            <span className="name">{`${fetchText ?? '取证'}日志`}</span>
                        </div>
                    </NavLink>
                </Auth>

            </li>
            <li>
                <NavLink to="/log/parse-log" replace={true} className="hvr-sweep-to-right">
                    <div>
                        <span className="ico"><FontAwesomeIcon icon={faArrowsRotate} /></span>
                        <span className="name">{`${parseText ?? '解析'}日志`}</span>
                    </div>
                </NavLink>
            </li>
            <li>
                <Auth deny={!useServerCloud}>
                    <NavLink to="/log/cloud-log" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faCloud} /></span>
                            <span className="name">云取日志</span>
                        </div>
                    </NavLink>
                </Auth>
            </li>
        </ul>
    </MenuPanel>
    <Route
        path="/log"
        exact={true}
        component={() => <ContentBox title={`${fetchText ?? '取证'}日志`}><FetchLog /></ContentBox>} />
    <Route
        path="/log/fetch-log"
        component={() => <ContentBox title={`${fetchText ?? '取证'}日志`}><FetchLog /></ContentBox>} />
    <Route
        path="/log/parse-log"
        component={() => <ContentBox title={`${parseText ?? '解析'}日志`}><ParseLog /></ContentBox>} />
    <Route
        path="/log/cloud-log"
        component={() => <ContentBox title={`云${fetchText ?? '取证'}日志`}><CloudLog /></ContentBox>} />
</LogLayout>;

export default Index;
