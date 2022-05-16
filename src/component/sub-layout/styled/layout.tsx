import styled from 'styled-components';

/**
 * 设置页左右分栏
 */
const Layout = styled.div`
    position: relative;
    width:auto;
    height: 100%;
    display:flex;
    flex-direction: row;
    .sub-container{
        position: relative;
        flex:1;
        .sub-header{
            height: 55px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding:0 2rem;
        }
    }
`;

const ScrollBox = styled.div`
    position:absolute;
    top:55px; //减去头部高55px的标题栏
    left:0;
    bottom:0;
    right:0;
    box-sizing: border-box;
    overflow-y: auto;

`;

const MainBox = styled.div`
    position: absolute;
    top:0;
    right: 0;
    bottom: 10px;
    left: 0;
    background-color: #202940;
    border-radius: ${props => props.theme['border-radius-base']};
    margin:0 10px;
    padding: 10px;
`;

export { Layout, ScrollBox, MainBox }