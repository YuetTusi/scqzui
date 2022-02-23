import React, { FC } from 'react';
import { NavLink } from 'dva/router';
import { Image } from './styled/button';
import { ImageButtonProp } from './prop';

/**
 * 图片大按钮
 */
const ImageButton: FC<ImageButtonProp> = ({ to, icon, src, children }) => {

    return <Image>
        <div className="push-img" style={{ backgroundImage: `url(${src})` }}>
            <NavLink to={to}>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </NavLink>
        </div>
    </Image>;
};

export default ImageButton;