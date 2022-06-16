import styled from 'styled-components';

export const ModalBox = styled.div`

	.tip-msg {
		display: block;
		border: 1px solid #303030;
		border-radius: 2px;
		.sub-tip {
			margin-top: 2px;
			font-weight: bold;
			font-size: 12px;
			padding-left: 12px;
		}
		em {
			color: ${props => props.theme['primary-color']};
			font-weight: bold;
			font-size: 12px;
			font-style: normal;
		}
		strong {
			color: #f5222d;
			font-weight: bold;
			font-size: 12px;
			font-style: normal;
		}
		legend {
			width: auto;
			margin-left: 10px;
			font-size: 12px;
			font-weight: bold;
		}
		ul {
			font-size: 12px;
			font-family: 'Arial';
			margin: 0;
			padding: 0 5px 5px 5px;
		}
		li {
			margin: 0 0 0 20px;
			padding: 0;
			color: ${props => props.theme['primary-color']};
			list-style-type: square;
		}
	}
	.form-box {
		margin-top: 12px;
	}
`;