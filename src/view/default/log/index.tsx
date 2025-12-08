import React, { FC } from 'react';
import { useDispatch } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faArrowsRotate, faCloud, faBolt } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Route } from 'dva/router';
import { helper } from '@/utils/helper';
import ContentBox from './content-box';
import { WifiBoxModal } from '@/component/dialog';
import Auth from '@/component/auth';
import Reading from '@/component/loading/reading';
import AlartMessage from '@/component/alert-message';
import FetchLog from '@/view/default/log/fetch-log';
import ParseLog from '@/view/default/log/parse-log';
import CloudLog from '@/view/default/log/cloud-log';
import { QuickLog } from '@/view/default/log/quick-log';
import { MenuPanel } from './styled/menu';
import { LogLayout } from './styled/sub-layout';

const {
    useFetch,
    useQuickFetch,
    useServerCloud,
    fetchText,
    parseText
} = helper.readConf()!;

/**
 * 设置布局页
 */
const Index: FC<{}> = () => {

    const dispatch = useDispatch();

    return <LogLayout>
        <Reading />
        <AlartMessage />
        <WifiBoxModal
            onCancel={() => dispatch({ type: 'wifiBoxModal/setOpen', payload: false })} />
        <MenuPanel>
            <div className="sub-title">
                操作日志
            </div>
            <ul>
                <Auth deny={!useFetch && !useServerCloud}>
                    <li>
                        <NavLink to="/log" exact={true} replace={true} className="hvr-sweep-to-right">
                            <div>
                                <span className="ico"><FontAwesomeIcon icon={faMobileScreenButton} /></span>
                                <span className="name">{`${fetchText ?? '取证'}日志`}</span>
                            </div>
                        </NavLink>
                    </li>
                </Auth>
                <li>
                    <NavLink to="/log/parse-log" replace={true} className="hvr-sweep-to-right">
                        <div>
                            <span className="ico"><FontAwesomeIcon icon={faArrowsRotate} /></span>
                            <span className="name">{`${parseText ?? '解析'}日志`}</span>
                        </div>
                    </NavLink>
                </li>
                <Auth deny={!useQuickFetch}>
                    <li>
                        <NavLink to="/log/quick-log" replace={true} className="hvr-sweep-to-right">
                            <div>
                                <span className="ico"><FontAwesomeIcon icon={faBolt} /></span>
                                <span className="name">快采日志</span>
                            </div>
                        </NavLink>
                    </li>
                </Auth>
                <Auth deny={!useServerCloud}>
                    <li>
                        <NavLink to="/log/cloud-log" replace={true} className="hvr-sweep-to-right">
                            <div>
                                <span className="ico"><FontAwesomeIcon icon={faCloud} /></span>
                                <span className="name">云取日志</span>
                            </div>
                        </NavLink>
                    </li>
                </Auth>
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
            path="/log/quick-log"
            component={() => <ContentBox title="快采日志"><QuickLog /></ContentBox>} />
        <Route
            path="/log/cloud-log"
            component={() => <ContentBox title={`云${fetchText ?? '取证'}日志`}><CloudLog /></ContentBox>} />
    </LogLayout>;
};

export default Index;
