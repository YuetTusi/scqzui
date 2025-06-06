import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import Spin from 'antd/lib/spin';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import { ReadingBox } from './styled/style';

let maxTime = 120;
let i = 0;

/**
 * 全局遮罩
 */
const Reading: FC<{}> = () => {

    const {
        reading,
        readingMessage,
        countDown
    } = useSelector<StateTree, AppSetStore>((state) => state.appSet);

    const [secondString, setSecondString] = useState<string>('');

    const clocker = (_: IpcRendererEvent) => {
        if (countDown) {
            setSecondString(`${maxTime - i}s`);
            i++;
        } else {
            maxTime = 120;
            i = 0;
            setSecondString('');
        }
    };

    useEffect(() => {
        ipcRenderer.on('clock-1', clocker);
        return () => {
            ipcRenderer.removeListener('clock-1', clocker);
        };
    }, [countDown]);

    return <ReadingBox style={{ display: reading ? 'flex' : 'none' }}>
        <Spin size="large" />
        <div>
            <span className="info">{readingMessage}</span>
            &nbsp;
            <span className="info">{countDown ? secondString : ''}</span>
        </div>
    </ReadingBox>
};

export default Reading;