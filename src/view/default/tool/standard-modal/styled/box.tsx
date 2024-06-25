import styled from 'styled-components';

export const StandardBox = styled.div`
    
    .stand-sort{
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

        .ant-checkbox-group-item{
            &>span{
                &:last-child{
                    &:hover{
                        color:${props => props.theme['link-color']};
                    }
                }
            }
        }

        &:last-child{
            margin-top: 16px;
        }
    }
`;