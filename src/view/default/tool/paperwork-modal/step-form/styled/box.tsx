import styled from 'styled-components';

export const StepFormBox = styled.div`

    .step-box{
        width: 90%;
        margin: 10px auto;
    }
    .ant-divider-horizontal{
        margin:0 !important;
    }
    .form-box{

        /* width: 80%;
        margin:20px auto 0 auto; */
    }
    .standard-card{
        .ant-card-body{
            height:110px;
            overflow-y: auto;
        }
        p{
            margin-bottom: 4px;
        }
    }

    .attach-card{
        .ant-card-body{
            height:198px;
            overflow-y: auto;
        }
        p{
            margin-bottom: 4px;
            .file-name{
                display: inline-block;
                margin-left: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: middle;
            }
        }
    }

    .sample-img{
        border:1px solid #303030;
        border-radius: 2px;
        padding: 0 16px 16px 16px;

        legend{
            display: inline-block;
            width: auto;
            padding: 0 2px;
            margin-left: 0;
            font-size: 1.4rem;
            color:${props => props.theme['link-color']};
        }
        &:last-child{
            margin-top: 16px;
        }

        .imgs{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            &>div{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .ant-btn{
                    margin-top: 16px;
                }
            }
        }
        .attaches{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            p{
                margin: 0;
            }
            .ant-btn{
                margin-top: 16px;
            }
        }
    }
    .preview-box{
        border: none;
    }
`;

export const FormOneBox = styled.div`

    display: block;
    padding:8px 16px;
`;

export const FormTwoBox = styled.div`

    display: block;
    padding:8px 16px;
`;


export const FormThreeBox = styled.div`

    display: flex;
    flex-direction: row;

    .dev-box{
        flex:none;
        position: relative;
    }
    .form-three-box{
        flex:1;
        padding:8px 16px;
    }
`;

export const FormFourBox = styled.div`

    display: block;
    padding:8px 16px;
`;

export const DeviceListBox = styled.div`

    overflow: auto;
    border-right:1px solid #303030;
    width: 180px;
    height: 100%;

    ul{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:0;
        padding:0;
    }
    li{
        margin:0;
        padding:0;
        list-style-type: none;
        &>span{
            display: block;
            width: 100%;
            padding:4px 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color:${props => props.theme['primary-color']};
        }
        &.active{
            color:#fff;
            background-color: ${props => props.theme['primary-color']};
        }
        &:hover{
            cursor: pointer;
            background-color: ${props => props.theme['primary-color']};
            transition: .2s;
            &>span{
                color:#fff;
            }
        }
    }
`;

export const AttachListBox = styled.div`

    overflow: auto;
    border:1px solid #303030;
    border-radius: 2px;
    width: 100%;
    height: 200px;

    ul{
        margin:0;
        padding:0;
    }
    li{
        margin:0;
        padding:2px 0 2px 8px;
        list-style-type: none;
        
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .file-info{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .file-name{
                display: inline-block;
                max-width:380px;
                margin-left: 8px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
`;


export const EmptyBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
`;