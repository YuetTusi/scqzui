import styled from 'styled-components';

const MenuPanel = styled.div`

    display: grid;
    height: 100%;
    width: auto;
    /* overflow-x: auto; */
    /* grid-template-rows: 50% 50%; */
    grid-template-columns: repeat(4, minmax(350px, 350px));
    grid-auto-flow: column;
    grid-gap: 20px;

    .evidence{
        grid-row-start: 1;
        grid-row-end:3;
    }
    .tool{
        grid-row-start: 1;
        grid-row-end:3;
    }
    .last{
        width: 0;
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