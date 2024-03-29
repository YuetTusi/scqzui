import styled from 'styled-components';

export const FormBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:0 4px;
    ul,li{
        margin:0;
        padding: 0;
    }
    li{
        list-style-type: none;
        display: inline;
        margin-left: 10px;
        &:nth-child(1){
            margin-left: 0;
        }
    }
`;

export const ExcelList = styled.div`

    position: relative;
    background-color: #141414;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &.nothing{
        position: absolute;
        top:32px;
        right:0;
        bottom:0;
        left:0;
    }
    ul{
        flex:1;
        margin:0;
        padding:0;
        li{
            margin:0;   
            padding:8px 10px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #303030;
            &>a{
                span{
                    margin-left: 5px;
                }
            }

            &:last-child{
                border-bottom: none;
            }
        }
    }
`;
