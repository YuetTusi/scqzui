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
    border-radius: 3px;

    &>.caption{
        color:#fff;
        font-size: 1.4rem;
        padding: 5px 10px;
        border-top-left-radius: 3px;
        border-top-right-radius:3px;
        background-color: ${props => props.theme['primary-color']};
    }
    &>.content{
        color:#ffffffd9;
    }
`;

export { Split, SortPanel };