import React, { FC } from 'react';
import { AuthProp } from './prop';

/**
 * 降级组件
 */
const Demotion: FC<{ widget?: JSX.Element | string }> = ({ widget }) =>
    widget === undefined
        ? null
        : <>{widget}</>;

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

export default Auth;