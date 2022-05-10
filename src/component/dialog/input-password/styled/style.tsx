import styled from 'styled-components';

export const DescBox = styled.div`

    font-size:1.2rem;
    em{
        font-style: normal;
        text-decoration: none;
        color:${props => props.theme['link-color']};
    }
`;

export const PasswordPanel = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    .ant-btn {
        margin-left: 5px;
    }
    .blue-ico {
        color: ${props => props.theme['primary-color']};
    }
`;