import styled from 'styled-components';


const ExtendPanel = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 15px;
    display: flex;
    justify-content: flex-start;
    /* 对于宽屏设备将按钮区居中 */
    @media screen and (min-width:2000px){
        justify-content: center;
    }
    overflow-x: scroll;
    scroll-behavior:smooth;
`;

export { ExtendPanel }