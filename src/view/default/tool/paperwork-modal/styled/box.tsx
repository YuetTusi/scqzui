import styled from 'styled-components';

export const PaperworkModalBox = styled.div`

    display: flex;
    flex-direction: row;

    .form-box{
        flex:1;
    }
    .tree-box{
        position: relative;
        flex:none;
        width:300px;
        overflow: auto;
        border-right: 1px solid #303030;

        .full-box{
            position: absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
        }

        .ant-tree-node-content-wrapper{
            white-space: nowrap !important;
        }
    }
`;