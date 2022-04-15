import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

type PathType = "home" | "desktop" | "documents" | "downloads"
    | "music" | "pictures" | "videos" | "appData" | "userData"
    | "cache" | "temp" | "exe" | "module" | "recent" | "logs"
    | "crashDumps";

/**
 * 获取系统路径
 * @param type 类型
 */
function useOsPath(type: PathType) {

    const [dir, setDir] = useState<string>(process.cwd());

    useEffect(() => {
        (async () => {
            setDir(await ipcRenderer.invoke('get-path', type));
        })();
    }, []);

    return dir;
}

export { useOsPath };