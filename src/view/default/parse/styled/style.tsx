import styled from 'styled-components';

export const ParseBox = styled.div`
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
`;

export const ParsingPanel = styled.div`
    flex:none;
    margin: 10px 10px 0 10px;
`;

export const TableBox = styled.div`
    flex:1;
    padding: 0 10px;
    margin-bottom: 10px;
    height: 100%;
    display: flex;
    flex-direction: row;
    .title-bar{
        flex:none;
        color:#fff;
        padding: 5px 5px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: ${props => props.theme['primary-color']};
    }
    &>.case-list{
        height: 100%;
        background-color: #141414;
        flex:none;
        border-radius: 3px;
    }
    &>.dev-list{
        flex:1;
        height: 100%;
        background-color: #141414;
        margin-left: 10px;
        border-radius: 3px;
    }
`;
