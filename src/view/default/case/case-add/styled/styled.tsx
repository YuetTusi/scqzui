import styled from 'styled-components';
import { darken } from 'polished'

export const CaseBox = styled.div`
    position: absolute;
    top:0;
    right: 0;
    bottom: 10px;
    left: 0;
    background-color: ${props => props.theme['panel-color']};
    border-radius: ${props => props.theme['border-radius-base']};
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
    background-color: ${props => props.theme['background-color']};
    border-radius: ${props => props.theme['border-radius-base']};
    overflow: auto;
    padding-top: 30px;

    .cate {
		.cate-bar {
            margin-top: 30px;
			text-align: left;
			background-color: ${props => props.theme['primary-color']};
            border-top: 1px solid ${props => darken(0.1, props.theme['primary-color'])};
			border-bottom: 1px solid ${props => darken(0.1, props.theme['primary-color'])};
			line-height: 40px;
			margin-bottom: 15px;

			& > svg {
				color: #fff;
                margin-left:10px;
				padding: 0 5px;
			}

			span {
				color: #fff;
				margin-left: 5px;
			}
		}
	}
`;