import styled from 'styled-components';

export const QuickQRCodeModalBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &>p{
        font-size: 1.2rem;
        color:${props => props.theme['primary-color']}
    }
`;