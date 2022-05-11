import styled from 'styled-components';

export const EventDescBox = styled.div`

    display: flex;
    flex-direction: row;

    em{
        color:${props => props.theme['primary-color']};
        font-size: 1.2rem;
        font-style: normal;
        text-decoration: none;
        padding-bottom: 10px;
    }

    &>.qr{
        display: flex;
        flex-direction: column;
    }
    &>.desc{
        flex:1;
        margin-left: 10px;
    }

    .ibox{
        border:1px solid #303030;
        border-radius: ${props => props.theme['border-radius-base']};
        &>.caption{
            color:#fff;
            padding: 5px 5px;
            border-top-left-radius: ${props => props.theme['border-radius-base']};
            border-top-right-radius: ${props => props.theme['border-radius-base']};
            background-color: ${props => props.theme['primary-color']};
        }
        &>.content{
            color:#fff;
            padding: 14px;
            height: 240px;

            ul{
                margin:0;
                padding: 0;
            }
            li{
                margin:0;
                padding: 5px 0;
                list-style-type: none;
                label{
                    display: inline-block;
                    width: 100px;
                    vertical-align: middle;
                }
                span{
                    display: inline-block;
                    width: 390px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    vertical-align: middle;
                    color: ${props => props.theme['primary-color']};
                }
            }
        }
    }
`;