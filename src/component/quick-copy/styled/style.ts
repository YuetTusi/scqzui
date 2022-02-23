import styled from 'styled-components';

const QuickCopyBox = styled.div`
	position: relative;
	display: inline-block;
	padding-right: 30px;
	& > .float-cpy {
		position: absolute;
		top: 2px;
		right: 0;
		display: none;
	}
	&:hover {
		& > .float-cpy {
			display: block;
		}
	}
`;

export { QuickCopyBox };