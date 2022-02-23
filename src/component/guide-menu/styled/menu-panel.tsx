import styled from 'styled-components';

const MenuPanel = styled.div`

    display: grid;
    height: 100%;
    width: auto;
    /* overflow-x: auto; */
    /* grid-template-rows: 50% 50%; */
    grid-template-columns: repeat(4,minmax(350px,400px));
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
`;

export { MenuPanel };