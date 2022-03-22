import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import React, { FC, memo } from 'react';
import { useDispatch } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons';

const DragBarBox = styled.div`
    box-sizing: border-box;
    height: 24px;
    background-color: #181d30;
    display: flex;
    flex-direction: row;
    &>.app-name{
        position: relative;
        flex:1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color:#a9afbbd1;
        font-size: 1.2rem;
        padding-left: 1rem;
        -webkit-app-region: drag;
    }
    &>.app-buttons{
        position: relative;
        flex:none;
        &>a{
            cursor: pointer;
            display: inline-block;
            padding:0 12px;
            background-color: #141414;
            color:#fff;
            text-align: center;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            &:nth-child(1){
                border-right: 1px solid #141414;
                border-bottom-right-radius: 0;
                background-color: #2b3347;
                &:hover{
                    background-color: #5c6a8f;
                }
            }
            &:nth-child(2){
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 3px;
                border-right: 1px solid #141414;
                margin-right: 10px;
                background-color: #2b3347;
                &:hover{
                    background-color: #5c6a8f;
                }
            }
            &:nth-child(3){
                border-bottom-left-radius: 3px;
                border-bottom-right-radius: 0;
                padding:0 24px;
                margin-right: 0;
                background-color: #e84749;
                &:hover{
                    background-color: #d70003;
                }
            }
        }
    }
`;

/**
 * 应用标题栏
 */
const DragBar: FC<{}> = memo(({ children }) => {

    const dispatch = useDispatch();

    return <DragBarBox>
        <div className="app-name">
            <span>{children}</span>
        </div>
        <div className="app-buttons">
            <a onClick={() => ipcRenderer.send('minimize')}>
                <FontAwesomeIcon icon={faWindowMinimize} />
            </a>
            <a onClick={() => ipcRenderer.send('maximize')}>
                <FontAwesomeIcon icon={faWindowMaximize} />
            </a>
            <a onClick={() => dispatch({ type: 'appSet/fetchingAndParsingState' })} title="退出">
                <FontAwesomeIcon icon={faXmark} />
            </a>
        </div>
    </DragBarBox>
});

export default DragBar;