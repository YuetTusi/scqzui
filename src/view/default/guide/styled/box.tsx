import styled from 'styled-components';

const GuideBox = styled.div`

    position: absolute;
    top:20px;
    left:100px;
    bottom:20px;
    right:0;

    .right-opacity{
        position: fixed;
        top:94px;
        right:15px;
        bottom: 0;
        width: 40px;
        /* filter: blur(10px); */
        pointer-events: none;
        background-image: linear-gradient(to right, rgba(15, 34, 77, 0),rgba(15, 34, 77, 1));
    }
`;

export { GuideBox };