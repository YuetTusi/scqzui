import React, { FC, useEffect, useRef } from 'react';
import BoardMenu from '@/component/guide-menu';
import { ExtendPanel } from './styled/extend-panel';
import { GuideBox } from './styled/box';

const Guide: FC<{}> = () => {

    const scrollRef = useRef<HTMLDivElement>(null);

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


    return (
        <GuideBox>
            <ExtendPanel ref={scrollRef}>
                <BoardMenu>
                    Dashboard
                </BoardMenu>
            </ExtendPanel>
            <div className="fn-hidden"></div>
        </GuideBox>
    );
};

export default Guide;
