import styled from 'styled-components';
import color2 from 'tinycolor2';

const DeivceBox = styled.div`

    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    color:${(props => props.theme['text-color'])};
    width:300px;
    height:400px;
    padding: 10px;
    border-radius: ${props => props.theme['border-radius-base']};
    background-color:#056099;

    &.not-connected{
        background-color:rgba(34,126,165,0.2);
    }
    &.connected{
        background-color:#056099;
    }
    &.fetching{
        background-color:#056099;
    }
    &.finished{
        background-color:#056099;
    }
    &.has-error{
        background-color:#056099;
    }

    .ico{
        height: 170px;
        width:100%;
        border-bottom: 1px solid #a9afbbd1;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:center;
        font-size: 10rem;

        .ant-progress-text{
            color:${(props => props.theme['text-color'])};
        }
    }
    .fns{
        flex:1;
        display:flex;
        flex-direction: column;
        justify-content:space-around;
        align-items:center;
        width: 100%;
        padding: 10px 0;
        .help{
            &>div{
                padding:2px 0;
            }
            &>.extra{
                margin:0;
                padding: 0;
                font-size:1.2rem;
                font-weight: normal;
                color:${(props => props.theme['error-color'])};
            }
            &>.clock{
                text-align: center;
            }
            &>.progress{
                padding: 10px 5px;
                color:${(props => props.theme['text-color'])};
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
            padding-top: 10px;
            &>.ant-btn-group{
                flex:1;
            }
        }
    }

    &.flash {
        cursor: pointer;
        animation: flashBg 0.6s ease-out infinite;
    }

    @keyframes flashBg {
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
`;

const Nothing = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    .nothing-desc{
        color:${(props => props.theme['text-color'])};
    }
`;

export { DeivceBox, Nothing };