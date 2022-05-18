import styled from 'styled-components';

export const ListBox = styled.div`
    position: relative;
    border-radius: ${props => props.theme['border-radius-base']};
    border:1px solid #303030;
    height: 100%;
    display: flex;
    flex-direction: column;

    &>.title{
        flex:none;
        color:#fff;
        padding: 5px 5px;
        border-top-left-radius: ${props => props.theme['border-radius-base']};
        border-top-right-radius: ${props => props.theme['border-radius-base']};
        background-color: ${props => props.theme['primary-color']};
    }
    &>.dev{
        flex:1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: scroll;
        padding-top: 10px;
        padding-bottom: 10px;

        .d-empty{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 324px;
        }

        
        .d-item{
            flex: none;
            width: 240px;
            height: auto;
            border-radius: ${props => props.theme['border-radius-base']};
            margin-left: 10px;
            background-color: #056099;

            display: flex;
            flex-direction: column;
            .prog{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 20px 0;
                border-bottom: 1px solid #a9afbbd1;
            }
            .info{
                flex:1;
                .live{
                    color:${props => props.theme['primary-color']};
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin:10px;
                    padding: 0 5px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    background-color: #044066;
                    border-radius: ${props => props.theme['border-radius-base']};

                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                ul{
                    margin:0;
                    padding:0 10px 10px 10px;
                }
                li{
                    margin:0;
                    padding:1px 0;
                    list-style-type: none;
                    font-size:1.2rem;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    label{
                        display: inline-block;
                        width: 70px;
                    }
                    span{
                        display: inline-block;
                        font-weight: bold;
                        max-width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
`;

