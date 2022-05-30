import styled from 'styled-components';

const UnitNameBox = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .info-bar{
        padding-right: 1rem;
        em{
            color:${(props) => props.theme['primary-color']};
            font-weight: bold;
            font-style: normal;
        }
    }

    .btn-box{
        flex: none;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        label{
            white-space: nowrap;
        }
        &> .ant-btn{
            margin-left:16px;
        }
    }
`;

export { UnitNameBox };