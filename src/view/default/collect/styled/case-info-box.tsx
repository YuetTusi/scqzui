import styled from 'styled-components';
import { lighten } from 'polished';

const CaseInfoBox = styled.div`
    & > div{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        & > .txt{
            display: inline-block;
            color:#fff;
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
            color:${(props) => lighten(0.1, props.theme['link-color'])};
        }
    }
`;

export { CaseInfoBox };