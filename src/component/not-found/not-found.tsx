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

/**
 * 未找到视图
 */
const NotFound: FC<{}> = () => {

    const dispatch = useDispatch();

    return <NotFoundBox>
        <Result
            title="您访问的功能仍在建设当中，稍安勿躁"
            subTitle="请返回主页"
            extra={<Button
                onClick={() => dispatch(routerRedux.push('/guide'))}
                type="primary">
                <HomeOutlined />
                <span>主页</span>
            </Button>}
        />
    </NotFoundBox>
};

export default NotFound;