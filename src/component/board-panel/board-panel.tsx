import React, { FC } from 'react';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import Button from 'antd/lib/button';
import { Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';
import { helper } from '@/utils/helper';
import { routerRedux, useDispatch } from 'dva';

const caption = helper.readAppName();

/**
 * @description 首屏按钮面板
 */
const BoardPanel: FC<{}> = ({ children }) => {

    const dispatch = useDispatch();

    return <>
        <Header>
            <div className="header-caption">{caption ?? ''}</div>
            <div className="header-buttons">
                <HomeOutlined onClick={() => dispatch(routerRedux.push('/'))} />
                <MenuOutlined />
            </div>
        </Header>
        <Center>
            {children}
        </Center>
        <Footer>
            <div>
                Copyright © 2022 北京万盛华通科技有限公司
            </div>
        </Footer>
    </>
};

export default BoardPanel;
