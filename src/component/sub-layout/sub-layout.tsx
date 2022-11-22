import React, { FC } from 'react';
import { useDispatch, routerRedux } from 'dva';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import Button from 'antd/lib/button';
import { Layout, ScrollBox } from './styled/layout';
import Reading from '../loading/reading';
import AlartMessage from '../alert-message';


/**
 * 布局页
 */
const SubLayout: FC<{ title?: string }> = ({ title, children }) => {

    const dispatch = useDispatch();

    return <Layout>
        <Reading />
        <AlartMessage />
        <div className="sub-container">
            <div className="sub-header">
                <div>{title ?? ''}</div>
                <div>
                    <Button
                        onClick={() => dispatch(routerRedux.push('/guide'))}
                        ghost={true}
                        type="primary"
                        size="small">
                        <HomeOutlined />
                        <span>主页</span>
                    </Button>
                </div>
            </div>
            <ScrollBox>
                {children}
            </ScrollBox>
        </div>
    </Layout>
};

export default SubLayout;