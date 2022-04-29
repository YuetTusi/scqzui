import React, { FC } from 'react';

/**
 * 鉴权显示
 */
const Auth: FC<{ deny: boolean }> = ({ deny, children }) =>
    deny ? null : <>{children}</>;

Auth.defaultProps = {
    deny: false
}

export default Auth;