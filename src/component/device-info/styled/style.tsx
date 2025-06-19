import styled from 'styled-components';

export const DeviceBox = styled.div`

    position:relative;
    padding: 10px;
    border-radius: ${props => props.theme['border-radius-base']};
    background-color: ${props => props.theme['background-color']};

    &>.loading-mask{
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
    }

    &>.dev-detail{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .os-ico{
            flex: none;
            font-size: 12rem;
            text-align: right;
            padding: 0 2rem;
        }
        .desc{
            flex:1;
            ul,li{
                margin:0;
                padding: 0;
                font-size: 1.2rem;
            }
            li{
                list-style-type: none;
                padding: 2px;
                label{
                    display: inline-block;
                    width: 80px;
                }
                span{
                    display: inline-block;
                    white-space: nowrap;
                    color:${props => props.theme['primary-color']};
                }
            }
        }
    }
`;