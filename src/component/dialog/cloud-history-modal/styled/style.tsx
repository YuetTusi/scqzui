import styled from 'styled-components';

export const CloudHistoryModalBox = styled.div`
    width: auto;

    .cloud-panel {
        display: flex;
        flex-direction: row;
        height: 380px;

        .left-tree {
            width: 280px;
            border-right: 1px solid #303030;
            overflow: auto;
        }
        .right-record {
            flex: auto;
            overflow-y: auto;
            &.empty {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
    }

    .history-list {
        margin: 0;
        padding: 0;
        .history-list-item {
            display: flex;
            margin: 0;
            padding: 6px 10px;
            list-style-type: none;
            border-bottom:1px solid #303030;

            label {
                flex: none;
                color: ${(props => props.theme['text-color'])};
                align-self: center;
            }

            span {
                flex: 1;
                padding-left: 10px;
            }

            &:last-child {
                border-bottom: none;
            }
        }
    }
`;