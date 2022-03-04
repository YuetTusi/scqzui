import styled from 'styled-components';

const ContentBox = styled.div`
    position: absolute;
    left: 0;
    top:0;
    right: 0;
    bottom:0;
    padding: 0 10px 10px 10px;
    display:flex;
    flex-direction: column;

    & > .hidden-scroll-bar{
        //隐藏滚动条
        display: block;
        position: absolute;
        z-index: 1;
        left: 10px;
        right: 10px;
        bottom: 10px;
        height: 17px;
        background-color: #202940;
    }
`;

const DevicePanel = styled.div`
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    flex:1;
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    padding:20px;
    background-color:#202940;

    & > div{
        &:first-child{
            margin-left: 10px;
        }
        margin-left: 20px;
    }
`;

export { ContentBox, DevicePanel };