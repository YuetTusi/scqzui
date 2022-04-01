import styled from 'styled-components';

const CheckInputModalBox = styled.div`
	width: auto;

    .app-tips {
        line-height: 4rem;
        text-indent: 3rem;
        font-size: 1.4rem;
        color: ${(props => props.theme['text-color'])};
    }

    .with-btn {
        display: inline;
        position: absolute;
        top:3px;
        right: 40px;
    }
`;

export { CheckInputModalBox };