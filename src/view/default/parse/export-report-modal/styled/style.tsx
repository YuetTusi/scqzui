import styled from 'styled-components';

export const ExportReportModalBox = styled.div`

    .export-panel {
		display: flex;
		flex-direction: column;
		.center-box {
			height: 450px;
			overflow: auto;
		}
	}

	.ztree {
		b {
			font-family: Arial, Helvetica, sans-serif;
			color: #00c5c5;
			font-style: normal;
			font-weight: normal;
		}
		i {
			font-family: Arial, Helvetica, sans-serif;
			color: #ec9d00;
			font-style: normal;
		}
		em {
			font-family: Arial, Helvetica, sans-serif;
			color: #ff0033;
			font-style: normal;
		}
	}
`;

export const CompleteMsgBox = styled.div`

    em {
		font-weight: bold;
		font-style: normal;
		text-decoration: none;
	}
	a {
		cursor: pointer;
		font-weight: bold;
		color: ${props => props.theme['primary-color']};
	}
`;

export const ControlBoxes = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	white-space: nowrap;
	&>.control-checkbox{
		margin:0 20px;
		&>span{
			cursor: pointer;
			margin-left: 5px;
		}
	}
	&>input{
		width: 200px;
	}
`;