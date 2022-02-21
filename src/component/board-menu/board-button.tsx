import React, { FC } from 'react';
import { ColorButton } from './styled/button';
import { BoardButtonProp } from './prop';

/**
 * 主屏大按钮
 */
const BoardButton: FC<BoardButtonProp> = ({ color, children }) => {

    return <ColorButton color={color}>
        {children}
    </ColorButton>;
};

export default BoardButton;