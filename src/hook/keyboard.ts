import { useEffect } from 'react';


type KeyType = 'keydown' | 'keyup' | 'keypress';

/**
 * 绑定键盘事件
 */
const useKeyboardEvent = (type: KeyType, handle: (e: KeyboardEvent) => void) => {

    useEffect(() => {

        document.addEventListener(type, handle);

        return () => {
            document.removeEventListener(type, handle);
        }
    }, []);
};

export { useKeyboardEvent };