import styled from 'styled-components';

export const EventDescBox = styled.div`

    display: flex;
    flex-direction: column;

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
                &>div{
                    display:inline-block
                }
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
            width: 100%;
            margin-top: 20px;
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
            }
        }
    }
`;

export const HorBox = styled.div`
    display:flex;
    flex-direction: row;
`;

export const HelpBox = styled.div`
    

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .step{
        align-self: stretch;
        padding:10px;
        border:1px solid #303030;
        background-color: #202940;
        border-radius:${props => props.theme['border-radius-base']};

        .desc{
            padding: 20px 5px;
            line-height: 1.8;
            strong{
                font-weight: normal;
                font-style: normal;
                text-decoration: none;
                color:${props => props.theme['primary-color']};
            }
        }
    }

    .step-label{
        display: inline-block;
        width:50px;
        text-align: center;
        border-radius: ${props => props.theme['border-radius-base']};
        color:#fff;
        background-color: ${props => props.theme['primary-color']};
    }
`;