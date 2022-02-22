import React, { FC } from 'react';
import { Center } from './styled/center';

/**
 * @description 布局页
 */
const LayoutPanel: FC<{}> = ({ children }) => {

    return <>
        {/* <Header>
            <div className="header-menu-item">
                
            </div>
            <div className="header-buttons">
                <HomeOutlined onClick={() => dispatch(routerRedux.push('/'))} />
                <MenuOutlined />
            </div>
        </Header> */}
        <Center>
            {children}
        </Center>
    </>
};

export default LayoutPanel;
