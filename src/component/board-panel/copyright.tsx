import React, { FC } from 'react';
import { helper } from '@/utils/helper';

/**
 * 版权信息显示
 */
const Copyright: FC<{}> = ({ children }) => {

    if (helper.isNullOrUndefinedOrEmptyString(children)) {
        return null
    } else {
        return <div>
            Copyright © {new Date().getFullYear()} {children}
        </div>
    }
};

Copyright.defaultProps = {
    info: undefined
}

export { Copyright };