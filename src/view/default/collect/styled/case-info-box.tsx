import styled from 'styled-components';
import color2 from 'tinycolor2';

const CaseInfoBox = styled.div`
    & > div{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        & > .txt{
            display: inline-block;
            color:${(props => props.theme['text-color'])};
            width: 90px;
            &:after{
                content:"："
            }
        }
        & > .val{
            display: inline-block;
            white-space: nowrap;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            color:${(props) => color2(props.theme['link-color']).brighten(20).toString()};
        }
    }
`;

export { CaseInfoBox };