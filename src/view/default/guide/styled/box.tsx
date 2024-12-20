import styled from 'styled-components';

const GuideBox = styled.div`

    position: absolute;
    top:20px;
    left:60px;
    bottom:20px;
    right:0;

    .right-opacity{
        position: fixed;
        top:94px;
        right:15px;
        bottom: 0;
        width: 40px;
        pointer-events: none;
        /* background-image: linear-gradient(270deg,#f8f8f8,hsla(0,0%,97.3%,0)); */
    }
    .left-opacity{
        position: fixed;
        top:94px;
        left:40px;
        bottom: 0;
        width: 40px;
        pointer-events: none;
        /* background-image: linear-gradient(to right, rgba(15, 34, 77, 0),rgba(15, 34, 77, 1)); */
    }
    .aim{
        cursor: pointer;
        position: absolute;
        bottom:20px;
        right:0;
        font-size:2.4rem;
        opacity: 0.33333;
        text-align: center;
        pointer-events: all;
        z-index: 10;
        &:hover{
            opacity: 1;
        }
    }
`;

export { GuideBox };