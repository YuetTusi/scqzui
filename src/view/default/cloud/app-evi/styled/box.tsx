import styled from 'styled-components';

export const AppEviBox = styled.div`

    display: flex;
    flex-direction: column;
    border:1px solid ${props => props.theme['border-color-base']};
    border-radius: ${props => props.theme['border-radius-base']};
    background-color: #181d30;
    margin:10px;
    /* width: 320px; */

    &:hover{
        transition: .2s;
        box-shadow:0px 0px 9px 1px ${props => props.theme['primary-color']};
        border:1px solid ${props => props.theme['primary-color']};
    }

    &>.c-caption{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid ${props => props.theme['border-color-base']};
        border-top-left-radius: ${props => props.theme['border-radius-base']};
        border-top-right-radius: ${props => props.theme['border-radius-base']};
        &>span{
            padding-left: 10px;
            color:${props => props.theme['primary-color']};
        }
    }
    &>.c-fn{
        padding: 20px 20px;

        &>.form-box{
            padding:20px 0;
        }
        &>.buttons{
            display:flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /* margin-top: 20px; */
        }
    }
`;