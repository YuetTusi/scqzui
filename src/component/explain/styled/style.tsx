import styled from 'styled-components';

export const ExplainBox = styled.fieldset`
    font-size: 1.2rem;
    border:1px solid #303030;
    border-radius: ${(props) => props.theme['border-radius-base']};

    &>.inner-field{
        padding: 4px 10px 4px 24px;
    }

    legend{
        font-size: 1.2rem;
        width: auto;
        display: inline-block;
        margin: 0 0 0 1rem;
        color:${(props) => props.theme['primary-color']};
    }

    em{
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        color:${(props) => props.theme['warn-color']};
    }
    strong{
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        font-weight: bold;
        color:${(props) => props.theme['error-color']};
    }
    ol{
        margin: 0;
        padding: 0;
        li{
            margin: 0;
            padding: 2px 0;
            list-style-position: outside;
            list-style-type: decimal;
        }
    }
    ul{
        margin: 0;
        padding: 0;
        li{
            margin: 0;
            padding: 2px 0;
            list-style-position: outside;
            list-style-type:disc;
        }
    }
`;