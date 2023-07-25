import styled from "styled-components";

export const PanelHeaderBox = styled.div`

    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const CloudAppModalBox = styled.div`
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
        top:0;
        right: 35px;
    }
`;