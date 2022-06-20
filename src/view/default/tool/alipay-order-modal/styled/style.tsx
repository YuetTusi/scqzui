import styled from 'styled-components';

export const TipFieldSet = styled.fieldset`

    margin:0;
    padding: 10px 10px 10px 10px;
    font-size:1.2rem;
    border:1px solid #303030;
    border-radius: ${props => props.theme['border-radius-base']};
    legend{
        display: inline-block;
        font-size:1.2rem;
        width: auto;
        margin:0;
    }
    ul,li{
        margin:0;
        padding: 0;
    }
    li{
        padding: 2px 0;
        list-style-type: none;
        color: ${props => props.theme['primary-color']};
        strong{
            color: ${props => props.theme['error-color']};
        }
    }
`;