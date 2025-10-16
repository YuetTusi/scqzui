import styled from 'styled-components';


const GuideModalBox = styled.div`
    .ant-modal-body {
        padding: 0 !important;
    }

    .flow {
        max-height: 680px;
        overflow-y: auto;

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