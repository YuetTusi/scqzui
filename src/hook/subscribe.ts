import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useEffect } from 'react';

/**
 * 事件回调
 */
type IpcHandle = (event: IpcRendererEvent, ...args: any[]) => void;

/**
 * 订阅IpcRenderer事件
 * @param {string} channel 频道名
 * @param {ipcHandle} handle 回调
 */
function useSubscribe(channel: string, handle: IpcHandle) {
    useEffect(() => {
        ipcRenderer.on(channel, handle);
        return () => {
            ipcRenderer.removeListener(channel, handle);
        };
    }, []);
}

export { useSubscribe };