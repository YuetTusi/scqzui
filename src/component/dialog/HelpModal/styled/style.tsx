import styled from 'styled-components';

const HelpModalBox = styled.div`
    width: auto;

    .ant-modal-body {
        padding: 0 !important;
    }

    .flow {
        display        : flex;
        justify-content: center;
        align-items    : center;
        min-height     : 550px;

        img {
            display: block;
            width  : 100%;
        }
    }
`;

export { HelpModalBox };