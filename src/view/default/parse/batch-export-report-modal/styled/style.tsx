import styled from 'styled-components';

export const BatchExportReportModalBox = styled.div`

	.batch-export-tips {
		display: block;
		border: 1px solid #303030;
		border-radius: ${props => props.theme['border-radius-base']};
		margin:0 5px;
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
			em {
				font-style: normal;
				font-weight: bold;
				color: red;
			}
		}
	}

	.export-panel {
		margin-top: 5px;
		height: 320px;
		overflow-y: auto;
	}

	.empty-report {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
		strong {
			font-family: Arial, Helvetica, sans-serif;
			color: ${props => props.theme['primary-color']};
			font-style: normal;
			font-weight: bold;
		}
	}
`;

export const ControlBoxes = styled.div`
	display: inline;
	& > span {
		cursor: pointer;
		margin-left: 5px;
		margin-right: 10px;
	}
	.ant-input {
		width: auto;
	}
`;
