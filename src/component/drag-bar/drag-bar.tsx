import { ipcRenderer } from 'electron';
import React, { FC, memo } from 'react';
import { useDispatch } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons';
import { DragBarBox } from './styled/style';

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