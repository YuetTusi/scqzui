import React, { FC, useEffect, useRef, MouseEvent } from 'react';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

    /**
     * 向右滚动Click 
     */
    const onToRightClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    };

    return <GuideBox>
        <ExtendPanel ref={scrollRef}>
            <BoardMenu>
                Dashboard
            </BoardMenu>
        </ExtendPanel>
        <div className="right-opacity">
            <div onClick={onToRightClick} className="aim" title="向右滚动">
                <FontAwesomeIcon icon={faAnglesRight} />
            </div>
        </div>
        <Reading />
    </GuideBox>;
};

export default Guide;
