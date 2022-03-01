import styled from 'styled-components';
import color2 from 'tinycolor2';

const DeivceBox = styled.div`

    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    color:#fff;
    width:300px;
    height:400px;
    padding: 10px;
    margin-left: 10px;
    border-radius: 5px;
    /* border-radius:${(props) => props.theme['border-radius-base']}; */
    background-image:linear-gradient(rgba(52,172,224,1),rgba(34,126,165,1));
    &.not-connected{
        background-image:linear-gradient(rgba(52,172,224,0.2),rgba(34,126,165,0.2));
    }
    &.connected{
        background-image:linear-gradient(#2d98da,#056099);
    }
    &.fetching{
        background-image:linear-gradient(#2d98da,#056099);
    }
    &.finished{
        background-image:linear-gradient(#2d98da,#056099);
    }
    &.has-error{
        background-image:linear-gradient(#2d98da,#056099);
    }

    .ico{
        flex:4;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:center;
        font-size: 8rem;

        .ant-progress-text{
            color:#fff;
        }
    }
    .fns{
        flex:5;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:center;
        width: 100%;
        .help{
            &>div{
                padding:2px 0;
            }
            &>.clock{
                text-align: center;
            }
            &>.progress{
                padding: 10px 5px;
                color:#fff;
                font-size: 1.2rem;
            }
            p{
                color:${(props) => color2(props.theme['link-color']).brighten(20).toString()};
                font-weight: bold;
                font-style: normal;
                text-align: center;
            }
            strong{
                color:#f5222d;
                font-weight: bold;
                font-style: normal;
            }
            ul{
                margin:0;
                padding:0;
                &>li{
                    margin:0;
                    padding:2px 0;
                    list-style-type: none;
                    label{
                        display: inline-block;
                        width:70px;
                        &:after{
                            content:"："
                        }
                    }
                    span{
                        color:${(props) => color2(props.theme['link-color']).brighten(20).toString()};
                        font-family:"Arial";
                    }
                }
            }
        }
        .rec-link{
            text-align: center;
            a{
                color:#26e5dc;
            }
        }
        .buttons{
            display: flex;
            flex-direction: row;
            padding-top: 20px;
            &>.ant-btn-group{
                flex:1;
            }
        }
    }
`;

const Nothing = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    .nothing-desc{
        color:#fff;
    }
`;

export { DeivceBox, Nothing };