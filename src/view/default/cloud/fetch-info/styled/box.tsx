import styled from 'styled-components';

export const InfoBox = styled.div`
    margin-bottom: 10px;

    .text-label{
        color:${props => props.theme['primary-color']};
    }
`;