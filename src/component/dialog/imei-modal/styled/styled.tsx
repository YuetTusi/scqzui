import styled from 'styled-components';

export const ImageBox = styled.div`

    display: flex;
    flex-direction:column;
    &>.msg{
        padding: 14px 25px;
        color:${props => props.theme['primary-color']};
    }

    &>.steps{
        display: flex;
        flex-direction:row;
        justify-content: space-evenly;
        .step{
            width: 300px;
            text-align: center;
            display: flex;
            flex-direction: column;
            &>span{
                padding: 10px;
                strong{
                    color:${props => props.theme['primary-color']};
                    &.warn{
                        color:${props => props.theme['warn-color']};
                    }
                }
            }
        }
    }
    img{
        height:520px;
    }
`;