import styled from 'styled-components';

export const PaperworkModalBox = styled.div`

    display: flex;
    flex-direction: row;

    .form-box{
        flex:1;
    }
    .tree-box{
        flex:none;
        width:300px;
        height: 580px;
        overflow: auto;
        border-right: 1px solid #303030;

        .ant-tree-node-content-wrapper{
            white-space: nowrap !important;
        }
    }
`;