import { ipcRenderer } from 'electron';
import { routerRedux, useDispatch } from 'dva';
import { useSubscribe } from '@/hook';
import { helper } from '@/utils/helper';
import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons';
import { DragBarBox } from './styled/style';

const { useLogin } = helper.readConf()!;

/**
 * 应用标题栏
 */
const DragBar: FC<{}> = memo(({ children }) => {

    const dispatch = useDispatch();

    useSubscribe('overtime', () => {
        //订阅空闲超时事件，若用户长时无操作则踢出登录页
        if (useLogin) {
            dispatch(routerRedux.push('/?msg=因长时间未使用，用户已登出'));
        }
    });

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