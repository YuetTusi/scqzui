import styled from 'styled-components';

export const BarBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .u-name{
        color:${props => props.theme['primary-color']};
        font-weight: bold;
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .u-btn{
        flex:none;
        display: flex;
        flex-direction: row;
        .ant-btn{
            margin-left: 16px;
        }
    }
`;