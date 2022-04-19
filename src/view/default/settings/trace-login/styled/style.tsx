import styled from 'styled-components';

export const StateBar = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const FormBox = styled.div`
    padding: 10px 10px;
    background-color: #141414;
    border-radius: ${props => props.theme['border-radius-base']};
`;