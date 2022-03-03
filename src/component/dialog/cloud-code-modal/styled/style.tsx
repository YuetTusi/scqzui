import styled from 'styled-components';

export const CloudCodeModalBox = styled.div`
	width: auto;
	.scroll-item {
		max-height: 400px;
		overflow-y: auto;
		padding: 0;
	}

    .capp-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #303030;
		padding: 5px 15px;

		&:last-child {
			border-bottom: none;
		}

		.capp-name {
			white-space: nowrap;
			font-size: 1.2rem;
			&::after {
				content: '：';
			}
		}

		.ant-btn-danger {
			&.valart {
				animation: vAlartBg 0.6s ease-out infinite;
			}
		}

		@keyframes vAlartBg {
			0% {
				background-color: #ff4d4f;
				border-color: #ff4d4f;
			}

			50% {
				background-color: #d80003;
				border-color: #d80003;
			}
		}
	}
	.fn-msg-panel {
		display: flex;
		strong {
			display: block;
			color: ${(props => props.theme['text-color'])};
			font-weight: bold;
			font-size: 1.2rem;
			width: 240px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			&:empty {
				&::after {
					color: #d9d9d9;
					font-weight: normal;
					content: '暂无消息';
				}
			}
		}
	}
	.fn-input-panel {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: auto;
		& > label {
			white-space: nowrap;
			font-size: 1.2rem;
			&::after {
				content: '：';
			}
		}
		.ant-btn {
			margin-left: 5px;
			font-size: 1.2rem;
		}
	}

`;