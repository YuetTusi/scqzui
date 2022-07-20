import { useEffect } from 'react';


type KeyType = 'keydown' | 'keyup' | 'keypress';

/**
 * 绑定键盘事件
 */
const useKeyboardEvent = (type: KeyType, element: HTMLElement, handle: (e: KeyboardEvent) => void) => {

    useEffect(() => {

        element.addEventListener(type, handle);

        return () => {
            element.removeEventListener(type, handle);
        }
    }, []);
};

export { useKeyboardEvent };