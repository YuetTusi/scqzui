import React, { FC, useEffect, useRef, MouseEvent } from 'react';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Reading from '@/component/loading/reading';
import BoardMenu from '@/component/guide-menu';
import { ExtendPanel } from './styled/extend-panel';
import { GuideBox } from './styled/box';

/**
 * 首屏按钮页
 */
const Guide: FC<{}> = () => {

    const scrollRef = useRef<HTMLDivElement>(null); //滚动div

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
    const onScrollToClick = (to: string) => {
        if (scrollRef.current) {
            to === 'left'
                ? scrollRef.current.scrollLeft = 0
                : scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    };

    return <GuideBox>
        <ExtendPanel ref={scrollRef}>
            <BoardMenu>
                Dashboard
            </BoardMenu>
        </ExtendPanel>
        <div className="left-opacity">
            <div onClick={() => onScrollToClick('left')} className="aim" title="滚动到最左">
                <FontAwesomeIcon icon={faAnglesLeft} />
            </div>
        </div>
        <div className="right-opacity">
            <div onClick={() => onScrollToClick('right')} className="aim" title="滚动到最右">
                <FontAwesomeIcon icon={faAnglesRight} />
            </div>
        </div>
        <Reading />
    </GuideBox>;
};

export default Guide;
