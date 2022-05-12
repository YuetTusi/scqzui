import React, { FC } from 'react';
import { NavLink } from 'dva/router';
import { Color } from './styled/button';
import { ColorButtonProp } from './prop';

/**
 * 主屏大按钮
 */
const ColorButton: FC<ColorButtonProp> = ({ to, icon, color, children }) => {

    if (typeof to === 'string') {
        return <Color color={color}>
            <NavLink to={to} replace={true}>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </NavLink>
        </Color>;
    } else {
        return <Color onClick={to} color={color}>
            <a>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </a>
        </Color>
    }
};

export default ColorButton;