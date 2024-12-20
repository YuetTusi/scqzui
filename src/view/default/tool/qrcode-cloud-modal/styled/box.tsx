import styled from 'styled-components';

export const QRCodeBox = styled.div`

    margin: 20px auto 0 auto;
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &>img{
        border: none;
    }
`;

export const TipBox = styled.div`

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
		ul,ol {
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
`;
