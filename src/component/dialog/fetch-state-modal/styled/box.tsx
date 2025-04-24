import styled from 'styled-components';

export const StatePanel = styled.div`
    width: 100%;
    max-height: 240px;
    overflow-y: auto;
`;

export const ListBox = styled.ul`

    margin:0;
    padding:0;

    .state-list-item {
        display: flex;
        margin: 0;
        padding: 6px 10px;
        list-style-type: none;
        border-bottom:1px solid #303030;

        label {
            flex: none;
            color: ${(props => props.theme['text-color'])};
            align-self: center;
            display: inline-block;
            text-align: right;
            width: 160px;
        }

        span {
            flex: 1;
            padding-left: 10px;
            color: ${(props => props.theme['primary-color'])};
        }

        &:last-child{
            border-bottom: none;
        }
    }
`;