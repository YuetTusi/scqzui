import React, { FC } from 'react';
import { ColorButton } from './styled/button';
import { GuideButtonProp } from './prop';

/**
 * 主屏大按钮
 */
const GuideButton: FC<GuideButtonProp> = ({ color, children }) => {

    return <ColorButton color={color}>
        {children}
    </ColorButton>;
};

export default GuideButton;