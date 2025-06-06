import styled from 'styled-components';

export const ReadingBox = styled.div`
    display: none;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 1001;
    background-color: rgba(20,20,20,0.8);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: wait;

    & .info{
        margin-top: 4px;
        color:${props => props.theme['primary-color']}; 
    }
`;