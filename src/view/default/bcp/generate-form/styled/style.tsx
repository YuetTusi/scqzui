import styled from 'styled-components';

export const GenerateFormBox = styled.div`

    padding: 20px 20px;
    margin-bottom: 10px;
    border-radius: ${props => props.theme['border-radius-base']};
    background-color: #141414;

    em {
        font-size  : 1.2rem;
        color      : #aaa;
        margin-left: 15px;
        font-style : normal;

        &.active {
            color: ${props => props.theme['primary-color']}
        }
    }

    .blank{
        width: 100%;
        height: 20px;
    }
`;
