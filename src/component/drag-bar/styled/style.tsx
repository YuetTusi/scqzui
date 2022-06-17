import styled from 'styled-components';

export const DragBarBox = styled.div`
    box-sizing: border-box;
    height: 24px;
    background-color:  transparent;
    display: flex;
    flex-direction: row;
    &>.app-name{
        position: relative;
        flex:1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color:#a9afbbd1;
        font-size: 1.2rem;
        padding-left: 1rem;
        -webkit-app-region: drag;
        &>span{
            text-indent: 5rem;
        }
    }
    &>.app-buttons{
        position: relative;
        flex:none;
        &>a{
            cursor: pointer;
            display: inline-block;
            padding:0 12px;
            background-color: #141414;
            color:#fff;
            text-align: center;
            border-bottom-left-radius: ${props => props.theme['border-radius-base']};
            border-bottom-right-radius: ${props => props.theme['border-radius-base']};
            &:nth-child(1){
                border-left: 1px solid #141414;
                border-bottom: 1px solid #141414;
                border-bottom-right-radius: 0;
                background-color: #2b3347;
                &:hover{
                    background-color: #5c6a8f;
                }
            }
            &:nth-child(2){
                border-bottom-left-radius: 0;
                border-bottom-right-radius: ${props => props.theme['border-radius-base']};
                border-right: 1px solid #141414;
                border-left: 1px solid #141414;
                border-bottom: 1px solid #141414;
                margin-right: 10px;
                background-color: #2b3347;
                &:hover{
                    background-color: #5c6a8f;
                }
            }
            &:nth-child(3){
                border-bottom-left-radius: ${props => props.theme['border-radius-base']};
                border-bottom-right-radius: 0;
                padding:0 24px;
                margin-right: 0;
                background-color: #a61d24;
                &:hover{
                    background-color: #d70003;
                }
            }
        }
    }
`;