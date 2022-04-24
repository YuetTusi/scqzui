import styled from 'styled-components';

export const QuickBox = styled.div`

	.quick-content {
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
	}

    .sort-box{
        border-radius: ${props => props.theme['border-radius-base']};
        &>.title{
            color: #fff;
            padding: 5px;
            border-top-left-radius:  ${props => props.theme['border-radius-base']};
            border-top-right-radius:  ${props => props.theme['border-radius-base']};
            background-color: ${props => props.theme['primary-color']};
        }
        &>.content{
            background-color: #141414;
        }
    }
`;


