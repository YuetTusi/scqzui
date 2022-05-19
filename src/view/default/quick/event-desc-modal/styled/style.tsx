import styled from 'styled-components';

export const EventDescBox = styled.div`

    display: flex;
    flex-direction: row;

    .ibox{
        width: 100%;
        &>.content{
            display: flex;
            flex-direction: row;
            ul{
                margin:0;
                padding: 0;
            }
            li{
                margin:0;
                padding: 5px 0;
                list-style-type: none;
                label{
                    display: block;
                }
                span{
                    display: block;
                    color: ${props => props.theme['primary-color']};
                }
            }
        }

        .event-info{
            position:relative;
            width: 100%;
            &>.caption{
                color:#fff;
                padding: 5px 5px;
                border-top-left-radius: ${props => props.theme['border-radius-base']};
                border-top-right-radius: ${props => props.theme['border-radius-base']};
                background-color: ${props => props.theme['primary-color']};
            }
            &>.cinfo{
                border-left:1px solid #303030;
                border-right:1px solid #303030;
                border-bottom:1px solid #303030;
                border-bottom-left-radius: ${props => props.theme['border-radius-base']};
                border-bottom-right-radius: ${props => props.theme['border-radius-base']};
                padding: 20px;
                position: absolute;
                top:32px;
                left:0;
                right:0;
                bottom:0;
            }
        }
    }
`;

export const HelpBox = styled.div`
    
    width: 320px;
    margin-right: 20px;

    .step-label{
        display: block;
        width:50px;
        text-align: center;
        border-radius: ${props => props.theme['border-radius-base']};
        color:#fff;
        background-color: ${props => props.theme['primary-color']};
    }
    &>p{
        margin:0;
        padding: 5px 0;
    }
`;