import styled from 'styled-components';

export const CategoryBox = styled.div`
    text-align: left;
    background-color: ${props => props.theme['primary-color']};
    border-top: 1px solid #303030;
    border-bottom: 1px solid #303030;
    line-height: 40px;

    & > svg {
        color: #fff;
        margin-left:10px;
        padding: 0 5px;
    }

    span {
        color: #fff;
        margin-left: 5px;
    }
`;

export const AiLabel = styled.label`
    display: inline-block;
    width: 100%;
    text-align: right;
`;

export const ItemBox = styled.div<{ padding?: string }>`
    padding: ${(props) => props.padding ?? '20px'};
`;