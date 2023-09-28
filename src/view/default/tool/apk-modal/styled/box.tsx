import styled from 'styled-components';

export const ApkModalBox = styled.div`

    .apk-cbox {
		display: flex;
		flex-direction: row;
		& > .left {
			flex: 1;
			/* margin-right: 5px; */
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		/* & > .right {
			flex: none;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		} */
	}
	.tip-msg {
        width: 100%;
		display: block;
		border: 1px solid #303030;
		border-radius: 2px;
		&.full {
			//撑满空间
			flex: 1;
		}
		.sub-tip {
			margin-top: 2px;
			font-weight: bold;
			font-size: 12px;
			padding-left: 12px;
		}
		em {
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
            color: ${props => props.theme['primary-color']};
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
			list-style-type: square;
			em {
				font-style: normal;
				color: red;
			}
		}
		img {
			margin: 5px;
		}
	}
	.apk-msg {
		border: 1px solid ${props => props.theme['primary-color']};
		border-radius: 3px;

		.caption {
			background-color: ${props => props.theme['primary-color']};
			color: #fff;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			padding: 5px 8px;
		}

		.scroll-dev {
			height: 135px;
			overflow-y: auto;
		}
		ul {
			margin: 0;
			padding: 0;
		}
		li {
			margin: 0;
			padding: 4px 5px;
			list-style-type: none;
			font-size: 1.2rem;
			&:last-child {
				border-bottom: none;
			}
			&:nth-child(2n + 1) {
				background-color: fade(${props => props.theme['primary-color']}, 15%);
			}
		}
	}
	.table-box{
		border:1px solid #3a3a3a;
	}
	.apk-msg {
		margin-top: 10px;
		border: 1px solid ${props => props.theme['primary-color']};
		border-radius: 3px;

		.caption {
			background-color: ${props => props.theme['primary-color']};
			color: #fff;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			padding: 5px 8px;
		}

		.scroll-dev {
			height: 135px;
			overflow-y: auto;
		}
		ul {
			margin: 0;
			padding: 0;
		}
		li {
			margin: 0;
			padding: 4px 5px;
			list-style-type: none;
			font-size: 1.2rem;
			&:last-child {
				border-bottom: none;
			}
			&:nth-child(2n + 1) {
				background-color: fade(${props => props.theme['primary-color']}, 15%);
			}
		}
	}
`;