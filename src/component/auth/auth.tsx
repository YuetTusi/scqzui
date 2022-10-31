import React, { FC } from 'react';
import { Demotion } from './demotion';
import { AuthProp } from './prop';

/**
 * 鉴权显示
 */
const Auth: FC<AuthProp> = ({ deny, demotion, children }) =>
    deny
        ? <Demotion widget={demotion} />
        : <>{children}</>;


Auth.defaultProps = {
    deny: false,
    demotion: undefined
}

export { Demotion };
export default Auth;