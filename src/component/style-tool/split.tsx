import styled from 'styled-components';

const Split = styled.hr`

    margin:10px 0;
    border-top:none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #a9afbbd1;
`;

const SortPanel = styled.div`

    border: 1px solid #303030;
    border-radius: ${props => props.theme['border-radius-base']};;

    &>.caption{
        color:#fff;
        font-size: 1.4rem;
        padding: 5px 10px;
        border-top-left-radius: ${props => props.theme['border-radius-base']};;
        border-top-right-radius:${props => props.theme['border-radius-base']};;
        background-color: ${props => props.theme['primary-color']};
    }
    &>.content{
        color:#ffffffd9;
    }
`;

export { Split, SortPanel };