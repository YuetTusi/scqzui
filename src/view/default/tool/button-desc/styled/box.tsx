import styled from 'styled-components';

export const DescBox = styled.div`

    ul{
        margin:0 5px;
        padding:0;
        font-size: 1.2rem;
    }
    li{
        max-width: 360px;
        margin: 0 0 0 1.5rem;
        list-style-position: outside;
    }
    em{
        display: block;
        margin-top: 10px;
        font-size: 1.2rem;
        font-style:normal;
        color:${props => props.theme['primary-color']};
    }
`;