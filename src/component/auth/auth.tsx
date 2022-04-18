import React, { FC } from 'react';
import { AuthBox } from './styled/style';

type LayoutType = 'block' | 'inline-block' | 'inline'
    | 'flex' | 'inline-flex' | 'grid' | 'inline-grid'
    | 'table' | 'inline-table' | 'list-item';

/**
 * 鉴权显示
 */
const Auth: FC<{
    deny: boolean,
    layout?: LayoutType
}> = ({ deny, layout, children }) => {

    return <AuthBox deny={deny} layout={layout}>
        {children}
    </AuthBox >;
};

export default Auth;