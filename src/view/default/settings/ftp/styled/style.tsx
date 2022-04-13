import styled from 'styled-components';

export const BarBox = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const FormBox = styled.div`
    padding: 20px 10px;
    background-color: #141414;
    border-radius: ${props => props.theme['border-radius-base']};

    .note{
        padding-left: 1rem;
        font-size:1.2rem;
        font-style: normal;
        color:#a9afbbd1;
        &.enable{
            color:${props => props.theme['primary-color']}
        }
    }

    .switch-bar{
        padding-bottom: 10px;
        &>label{
            padding-right: 10px;
        }
    }
`;