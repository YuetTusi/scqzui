import styled from 'styled-components';

const NormalInputModalBox = styled.div`
	width: auto;

    .app-tips {
        line-height: 4rem;
        text-indent: 3rem;
        font-size: 1.4rem;
        color: ${(props => props.theme['text-color'])};
        .anticon{
            vertical-align: middle;
        }
        span{
            padding-left: 4px;
        }
    }

    .with-btn {
        display: inline;
        position: absolute;
        top:0;
        right: 35px;
    }
`;

const TipBox = styled.span`
    em{
        color:${props => props.theme['warn-color']};
        text-decoration: none;
        font-style: normal;
    }
`;

export { NormalInputModalBox, TipBox };