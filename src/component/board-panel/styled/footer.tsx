import styled from 'styled-components';

const Footer = styled.div`

    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color:#fff;
    height:50px;

    position:absolute;
    bottom:0;
    left:0;
    right:0;

    &>div{
        padding: 0;
        font-size: 1.4rem;
    }
`;

export { Footer };