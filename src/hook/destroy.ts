import { useEffect } from 'react';

/**
 * 组件销毁
 */
export function useDestroy(handle: Function) {

    useEffect(() => {
        return () => {
            handle();
        }
    });
}