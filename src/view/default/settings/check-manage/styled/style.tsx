import styled from 'styled-components';

export const FormBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:0 4px;
    ul,li{
        margin:0;
        padding: 0;
    }
    li{
        list-style-type: none;
        display: inline;
        &:nth-child(2){
            margin-left: 16px;
        }
    }
`;