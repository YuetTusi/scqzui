import React, { FC, memo } from 'react';
import { ExplainProp } from './prop';
import { ExplainBox } from './styled/style';

/**
 * 解释文案
 */
const Explain: FC<ExplainProp> = memo(
    ({ title, children }) => <ExplainBox>
        <legend>{title}</legend>
        <div className="inner-field">
            {children}
        </div>
    </ExplainBox>
);

export default Explain;