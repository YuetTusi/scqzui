import styled from 'styled-components';

const GuideBox = styled.div`

    position: absolute;
    top:20px;
    left:100px;
    bottom:20px;
    right:0;

    .fn-hidden{
        display:block;
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        height:17px;
        background-color: #181d30;
    }
`;

export { GuideBox };