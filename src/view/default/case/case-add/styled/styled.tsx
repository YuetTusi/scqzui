import styled from 'styled-components';

export const CaseBox = styled.div`
    position: absolute;
    top:0;
    right: 0;
    bottom: 10px;
    left: 0;
    background-color: #202940;
    border-radius: 2px;
    margin:0 10px;
    padding: 10px;

    .button-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
`;

export const FormBox = styled.div`
    position: absolute;
    top:62px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    background-color: #141414;
    border-radius: 2px;
    overflow: auto;
    padding-top: 30px;

    .cate {
		.cate-bar {
            margin-top: 30px;
			text-align: left;
			background-color: ${props => props.theme['primary-color']};
            border-top: 1px solid #303030;
			border-bottom: 1px solid #303030;
			line-height: 40px;
			margin-bottom: 15px;

			.anticon {
				color: #fff;
				margin-left: 14px;
			}

			span {
				color: #fff;
				margin-left: 5px;
			}
		}
	}
`;