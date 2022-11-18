import styled from 'styled-components';


export const CaseDataBox = styled.div`

    height: 100%;

	.case-content {
		padding: 10px;
		background-color:#202940;
		position: absolute;
		top: 0;
		left: 10px;
		right: 10px;
		bottom: 10px;
		border-radius: ${props => props.theme['border-radius-base']};
	}

	.search-bar {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		&>:nth-child(2){
			margin-left: 16px;
		}
	}

	.table-panel{
		position: absolute;
		top: 61px;
		left: 9px;
		right: 9px;
		bottom: 0px;
		overflow-y:auto;
	}

	.inner-device-table{
		.ant-table{
			font-size: 1.2rem;
			margin: 0 !important;
		}
	}
	.yes{
		font-size:1.8rem;
		color:#6abe39;
		vertical-align: middle;
	}
	.no{
		font-size:1.8rem;
		color:#e84749;
		vertical-align: middle;
	}
`;
