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
        &.flash {
            cursor: pointer;
            animation: flashAnim 0.6s ease-out infinite;
        }
        @keyframes flashAnim {
            0% {
                background-color:#cc0b15;
            }
            50% {
                background-color: #a3030b;
            }
            100% {
                background-color: #cc0b15;
            }
        }
    }
    &>.c-fn{
        padding: 20px 20px;

        &>.form-box{
            height: 150px;
            /* border: 1px solid yellow; */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        &>.qrcode-box{
            height: 150px;
            /* border: 1px solid yellow; */
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &>.buttons{
            display:flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
        }
    }
`;

/*
background
*/