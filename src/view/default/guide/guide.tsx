import throttle from 'lodash/throttle';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useKeyboardEvent } from '@/hook';
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
            scrollRef.current.style.scrollBehavior = 'auto';
            scrollRef.current.scrollLeft += deltaY - 10;
        }
    };

    /**
     * 左右滚动键盘事件
     */
    const onPanelKeydown = ({ code }: KeyboardEvent) => {
        if (scrollRef.current !== null) {
            scrollRef.current.style.scrollBehavior = 'smooth';
            switch (code) {
                case 'ArrowRight':
                    scrollRef.current.scrollLeft += 200;
                    break;
                case 'ArrowLeft':
                    scrollRef.current.scrollLeft -= 200;
                    break;
                default:
                    console.warn(`未知KeyCode:${code}`);
                    break;
            }
        }
    };

    useEffect(() => {
        if (scrollRef.current !== null) {
            scrollRef.current.style.scrollBehavior = 'smooth';
            scrollRef.current.addEventListener('wheel', onPanelWheel);
        }
        return () => {
            scrollRef.current?.removeEventListener('wheel', onPanelWheel);
        };
    }, []);

    useKeyboardEvent('keydown', throttle(onPanelKeydown, 100));

    /**
     * 左右滚动Click 
     * @param to 方向
     */
    const onScrollToClick = (to: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = 'smooth';
            const { scrollWidth } = scrollRef.current;
            to === 'left'
                ? scrollRef.current.scrollLeft = 0
                : scrollRef.current.scrollLeft = scrollWidth;
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
