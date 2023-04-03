import { ipcRenderer } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import Button from 'antd/lib/button';
import { useSubscribe } from '@/hook';
import { FetchData } from '@/schema/fetch-data';
import { AtPanel } from './styled/box';
import { ReadingProp } from './prop';

var readHandle: NodeJS.Timer | null = null;
var fetchDataReceive: FetchData | null = null;

/**
 * 阅读云取证协议
 */
const Reading: FC<ReadingProp> = ({ }) => {

    const [second, setSecond] = useState<number>(3);

    useEffect(() => {

        readHandle = setInterval(() => {
            setSecond(prev => prev - 1);
        }, 1000);

        return () => {
            if (readHandle) {
                clearInterval(readHandle);
                readHandle = null;
            }
        }
    }, []);

    useEffect(() => {
        if (second === 0 && readHandle !== null) {
            clearInterval(readHandle);
            readHandle = null;
        }
    }, [second]);

    /**
     * 订阅接收主进程消息
     */
    useSubscribe('show-protocol', (_, fetchData: FetchData) =>
        fetchDataReceive = fetchData
    );

    /**
     * 同意Click
     * @param e MouseEvent
     */
    const onAgreeClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        ipcRenderer.send('protocol-read', fetchDataReceive, true);
        fetchDataReceive = null;
    };

    /**
     * 不同意Click
     * @param e MouseEvent
     */
    const onDisagreeClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        ipcRenderer.send('protocol-read', fetchDataReceive, false);
        fetchDataReceive = null;
    };

    return <AtPanel>
        <h3>云取注意事项</h3>
        <div className="article">
            <p>1. 云取时，同手机号码，同种应用当日内只能取一次，多次可能会封号。</p>
            <p>2. 云取时，不要同时云取多个app，1-2个最好。</p>
            <p>
                3.云取时，鼠标指向云取app列表，会显示当前app可获取得数据，以及对手机端应用得影响，请仔细阅读。
            </p>
        </div>
        <div className="footer-button">
            <Button
                onClick={onAgreeClick}
                disabled={second !== 0}
                type="primary">
                已阅读且同意 {second === 0 ? "" : `（${second}）`}
            </Button>
            <Button
                onClick={onDisagreeClick}
                type="default">
                不同意
            </Button>
        </div>
    </AtPanel>
};

export { Reading };