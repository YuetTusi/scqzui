import styled from 'styled-components';

export const IssueBox = styled.div`
    margin : 0;
    padding: 0;

    .ant-modal-body {
        padding: 0 !important;
    }

    .list-empty {
        height         : 300px;
        display        : flex;
        justify-content: center;
        align-items    : center;
    }

    .list-block {
        height    : 400px;
        overflow-y: auto;

        .middle {
            display        : flex;
            flex-direction : column;
            align-self     : center;
            justify-content: center;
            height         : 400px;
        }
    }

    ul {
        margin : 0;
        padding: 0;
    }

    li {
        display        : flex;
        margin         : 0;
        padding        : 6px 10px;
        list-style-type: none;
        border-bottom: 1px solid ${props => props.theme['mode'] === 'dark' ? '#303030' : '#f0f0f0'};

        label {
            flex      : none;
            color: ${props => props.theme['text-color']};
            align-self: center;
        }

        span {
            flex        : 1;
            font-weight : normal;
            padding-left: 10px;
        }

        &:last-child {
            border: none;
        }
    }
`;
