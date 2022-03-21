import styled from 'styled-components';

export const BcpBox = styled.div`
    position: absolute;
    top:0;
    left:10px;
    right:10px;
    bottom:10px;
    overflow-y: auto;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    background-color: #202940;

    &>.scroll-panel{
        position: absolute;
        top:60px;
        left:10px;
        right:10px;
        bottom:0;
        overflow-y: auto;
    }

    &>.inner-box{
        padding: 0;
    }
`;

export const ButtonBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:10px 10px 0 10px;
`;

export const FormPanel = styled.div`
    margin-top: 10px;
    padding:0;
`;