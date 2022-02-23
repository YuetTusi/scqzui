import styled from 'styled-components';

const UnitNameBox = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .info-bar{
        flex:1;
        em{
            display: block;
            width:560px;
            color:${(props) => props.theme['primary-color']};
            font-weight: bold;
            font-style: normal;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .btn-box{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        label{
            white-space: nowrap;
        }
        &> .ant-btn{
            margin-left:5px;
        }
    }
`;

export { UnitNameBox };