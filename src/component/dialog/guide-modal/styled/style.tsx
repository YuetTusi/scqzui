import styled from 'styled-components';


const GuideModalBox = styled.div`
    .ant-modal-body {
        padding: 0 !important;
    }

    .flow {
        display        : flex;
        justify-content: center;
        align-items    : center;
        min-height     : 580px;

        img {
            display: block;
            width  : 100%;
        }
    }

    .text {
        display       : flex;
        flex-direction: row;
        padding       : 20px;
    }
`;


export { GuideModalBox };