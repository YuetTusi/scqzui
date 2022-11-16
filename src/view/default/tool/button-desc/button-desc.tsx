import React, { FC } from 'react';
import { ButtonDescProp } from './prop';
import { DescBox } from './styled/box';

const ButtonDesc: FC<ButtonDescProp> = ({ children }) => {

    return <DescBox>
        {children}
    </DescBox>
};

export { ButtonDesc };