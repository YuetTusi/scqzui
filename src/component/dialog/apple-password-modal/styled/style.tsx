import styled from 'styled-components';

export const ApplePasswordModalBox = styled.div`
    width: auto;

    .control {
        display: flex;

        label {
            flex       : none;
            text-align : right;
            line-height: 32px;
        }

        .widget {
            flex   : auto;
            display: flex;

            .ant-input {
                margin-right: 10px;
            }
        }
    }
`;

