import styled from 'styled-components';
import color2 from 'tinycolor2';

/**
 * 纯色按钮
 */
const Color = styled.div<{ color: string }>`
    cursor: pointer;
    color:#fff;
    width:100%;
    height:100%;
    border-radius: 3px;
    background-image: linear-gradient(${(props) => props.color ?? '#1B9CFC'},${(props) => color2(props.color).saturate(20).toString()});
    display: flex;
    flex-direction: column;

    &>a{
        flex: 1;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:center;
        font-size: 2rem;
        color:#fff;
        .icon-box{
            font-size: 8rem;
        }
        .text-box{
            padding-top:1rem;
            letter-spacing: 2px;
        }
    }
`;

/**
 * 图像按钮
 */
const Image = styled.div`
    cursor: pointer;
    box-sizing: border-box;
    color:#fff;
    width:100%;
    height:100%;
    border-radius: 3px;

    .push-img{
        position: relative;
        display:block;
        border-radius: 3px;
        width:100%;
        height:100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        

        &>a{
            position: absolute;
            bottom:30px;
            left:0;
            right:0;
            display: flex;
            flex-direction: row;
            justify-content:center;
            align-items: center;
            width: 100%;
            font-size: 2rem;
            color:#fff;
            .icon-box{
                
            }
            .text-box{
                letter-spacing: 2px;
                padding-left:1rem;
            }
        }
    }
`;

export { Color, Image };