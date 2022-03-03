import styled from 'styled-components';
import React, { FC } from 'react';
import { routerRedux, useDispatch } from 'dva';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import Result from 'antd/lib/result';
import Button from 'antd/lib/button';

const NotFoundBox = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const NotFound: FC<{}> = () => {

    const dispatch = useDispatch();

    return <NotFoundBox>
        <Result
            title="您访问的功能暂不支持"
            subTitle="请返回首页"
            extra={<Button
                onClick={() => dispatch(routerRedux.push('/'))}
                type="primary">
                <HomeOutlined />
                <span>首页</span>
            </Button>}
        />
    </NotFoundBox>
};

export default NotFound;