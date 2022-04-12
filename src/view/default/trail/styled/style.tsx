import styled from 'styled-components';

export const TrailBox = styled.div`
    position: absolute;
    top:0;
    left:10px;
    bottom: 10px;
    right: 10px;
    overflow-y: auto;
    border-radius: ${(props) => props.theme['border-radius-base']};
    background-color: #202940;
`;

export const ButtonBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:10px 10px 0 10px;
`;