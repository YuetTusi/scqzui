import styled from 'styled-components';

const ExtendPanel = styled.div`
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    overflow-x: scroll;

    //内层隐藏滚动条
    /* &::after {
        content:"";
        display:block;
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        height:17px;
        background-color: #181d30;
    } */
`;

export { ExtendPanel }