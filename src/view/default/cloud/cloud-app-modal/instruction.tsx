import React, { FC, memo } from 'react';
import styled from "styled-components";

export const InstructionBox = styled.div`
    p {
		margin: 0;
		padding-bottom: 0 0 2px 0;

		& > em {
			color: ${(props => props.theme['text-color'])};
			font-weight: 600;
			font-style: normal;
			text-decoration: none;
		}
		& > strong {
			color: #ef3133;
			font-weight: 600;
			font-style: normal;
			text-decoration: none;
		}
	}
`;


/**
 * 文案说明
 */
const Instruction: FC<{}> = memo(({ children }) =>
    <InstructionBox>{children}</InstructionBox>
);

export { Instruction };