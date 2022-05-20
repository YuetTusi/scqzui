import React, { FC, useEffect, useRef } from 'react';
import Reading from '@/component/loading/reading';
import BoardMenu from '@/component/guide-menu';
import { ExtendPanel } from './styled/extend-panel';
import { GuideBox } from './styled/box';

/**
 * 首屏按钮页
 */
const Guide: FC<{}> = () => {

    const scrollRef = useRef<HTMLDivElement>(null);

    /**
     * 按钮面板Wheel
     */
    const onPanelWheel = (event: WheelEvent) => {
        event.preventDefault();
        const { deltaY } = event;
        if (scrollRef.current !== null) {
            scrollRef.current.scrollLeft += deltaY - 10;
        }
    };

    useEffect(() => {
        if (scrollRef.current !== null) {
            scrollRef.current.addEventListener('wheel', onPanelWheel);
        }
        return () => {
            scrollRef.current?.removeEventListener('wheel', onPanelWheel);
        };
    }, []);

    return <GuideBox>
        <ExtendPanel ref={scrollRef}>
            <BoardMenu>
                Dashboard
            </BoardMenu>
        </ExtendPanel>
        {/* <div className="right-opacity"/> */}
        <Reading />
    </GuideBox>;
};

export default Guide;
