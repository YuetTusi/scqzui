import styled from 'styled-components';


export const CaseDataBox = styled.div`

    height: 100%;
	// margin: 5px 5px 0 5px;
	position: relative;

	.case-content {
		overflow-y: auto;
		padding: 5px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 50px;
	}

	.fix-buttons {
		position: absolute;
		right: 5px;
		bottom: 5px;
		.ant-btn {
			margin-left: 5px;
		}
		.hidden {
			display: none;
		}
	}

	.search-bar {
		display: flex;
		padding: 5px;
		border-bottom: 1px solid #eeeeee;
	}

	.table-root {
		height: calc(100% - 40px);
	}

	.ant-tag {
		margin-right: 0;
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
