import styled from 'styled-components';

const MenuPanel = styled.div`
    display: grid;
    width: auto;
    height: 100%;
    grid-template-columns: repeat(4, minmax(350px, 350px));
    @media screen and (min-height:980px) and (max-height:1080px){
        grid-template-columns: repeat(4, minmax(380px, 380px));
    }
    @media screen and (min-height:1080px){
        grid-template-columns: repeat(4, minmax(410px, 410px));
    }
    grid-auto-flow: column;
    grid-gap: 20px;

    .evidence,.cloud,.tool{
        grid-row-start: 1;
        grid-row-end:3;
    }
    &::after{
        content: "";
        width: 0;
        height: auto;
        grid-row-start: 1;
        grid-row-end:3;
    }
`;

const VersionBox = styled.div`
    margin-top: 2rem;
    p{
        padding: 5px 0;
        margin: 0;
        font-size: 1.2rem;
        label{
            display: inline-block;
            width: 70px;
        }
        span{
            color:#0fb9b1;
        }
    }
`;

export { MenuPanel, VersionBox };