import styled from 'styled-components';

const MenuPanel = styled.div`

    display: grid;
    height: 100%;
    width: auto;
    overflow-x: auto;
    grid-template-rows: 33% 33%;
    grid-template-columns: 260px  260px  260px 260px;
    /* grid-auto-flow: column;*/
    grid-gap: 20px;
`;

export { MenuPanel };