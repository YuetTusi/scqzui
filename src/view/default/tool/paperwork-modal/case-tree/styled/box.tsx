import styled from 'styled-components';

export const TreeLoadingBox = styled.div`

    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(44,44,44,0.7);
    cursor: wait;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;