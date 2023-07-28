import styled from 'styled-components';

export const ContentBox = styled.div`
    position: absolute;
    left: 0;
    top:0;
    right: 0;
    bottom:0;
    padding: 0 10px 10px 10px;
    display:flex;
    flex-direction: column;

    & > .button-bar{
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
`;

export const ItemPanel = styled.div`
    position: relative;
    overflow-y: auto;
    width: 100%;
    flex:1;
    /* display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap; */
    padding:10px;
    background-color:#202940;
    border-radius: ${props => props.theme['border-radius-base']};
`;

export const EmptyBox = styled.div`
    position: absolute;
    width: 150px;
    height: 120px;
    margin-top: -60px;
    margin-left: -75px;
    top:50%;
    left:50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;