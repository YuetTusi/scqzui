import React, { FC, memo } from 'react';
import { InstructionBox } from './styled/styled';

/**
 * 文案说明
 */
const Instruction: FC<{}> = memo(({ children }) =>
    <InstructionBox>{children}</InstructionBox>
);

export { Instruction };
