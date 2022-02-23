import styled from 'styled-components';

const ColorButton = styled.div<{ color: string }>`
    color:#fff;
    width:100%;
    height:100%;
    border-radius: 3px;
    background-color: ${(props) => props.color ?? '#1B9CFC'};
`;

export { ColorButton };