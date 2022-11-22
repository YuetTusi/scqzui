import React, { FC } from 'react';
import { routerRedux, useDispatch } from 'dva';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import Button from 'antd/lib/button';
import { ScrollBox } from '../styled/sub-layout';
import { ContentBoxProp } from './prop';

const ContentBox: FC<ContentBoxProp> = ({ title, children }) => {

    const dispatch = useDispatch();

    return <div className="user-log-container">
        <div className="user-log-header">
            <div>{title ?? ''}</div>
            <div>
                <Button onClick={() => dispatch(routerRedux.push('/guide'))} ghost={true} type="primary" size="small">
                    <HomeOutlined />
                    <span>主页</span>
                </Button>
            </div>
        </div>
        <ScrollBox>
            {children}
        </ScrollBox>
    </div>;
}

export default ContentBox;