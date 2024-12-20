import React, { FC, MouseEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import DoubleLeftOutlined from '@ant-design/icons/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons/DoubleRightOutlined';
import Empty from 'antd/lib/empty';
import Progress from 'antd/lib/progress';
import { useDestroy } from '@/hook';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { ParsingListState } from '@/model/default/parsing-list';
import ParseDetail from '@/schema/parse-detail';
import { ListBox } from './styled/style';
import { ParseDev } from './parse-dev';
import { ParsingDevProp, ParsingListProp } from './prop';

const { devText } = helper.readConf()!;

/**
 * 正在解析的设备列表
 * +---+
 * |###|
 * +---+
 * | | |
 * +---+
 */
const ParsingDev: FC<ParsingDevProp> = ({ info, devices }) => {

    const dispatch = useDispatch();
    const prevDetail = useRef<ParseDetail>();//上一条消息

    useEffect(() => {
        if (info !== undefined) {
            //有进度消息则记忆，当进度为空时展示上一次的进度值
            prevDetail.current = info;
        } 0
    }, [info]);

    /**
     * 解析中设备Click
     */
    const onItemClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (info?.caseId !== undefined) {
            dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [info.caseId] });
            dispatch({ type: 'parseDev/setCaseId', payload: info.caseId });
        }
        if (info?.deviceId !== undefined) {
            dispatch({ type: 'parseDev/setExpandedRowKeys', payload: [info.deviceId] }); //点击自动展开设备表格行
        }
    };

    const progFormatter = (percent?: number) => {
        if (percent === 100) {
            return <span style={{ color: '#0fb9b1' }}>完成</span>;
        } else {
            return <span>{`${percent}%`}</span>;
        }
    };

    return <div className="d-item" onClick={onItemClick}>
        <div className="prog">
            <Progress
                percent={info?.curprogress ?? prevDetail.current?.curprogress}
                format={progFormatter}
                type="circle"
                strokeColor="#26e5dc" />
        </div>
        <div className="info">
            <div className="live" title={info?.curinfo}>
                {info?.curinfo ?? prevDetail.current?.curinfo}
            </div>
            <ParseDev devices={devices} detail={info} />
        </div>
    </div>;
};

/**
 * 进度列表
 */
const ParsingList: FC<ParsingListProp> = () => {

    const dispatch = useDispatch();
    const { info, devices } = useSelector<StateTree, ParsingListState>(state => state.parsingList);
    const devRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        info.forEach(item => {
            const exist = devices.some(dev => item.deviceId === dev._id);

            if (!exist) {
                //如果列表中没有对应的设备，查库追加到列表中
                dispatch({ type: 'parsingList/queryDev', payload: { deviceId: item.deviceId } });
            }
        });
    }, [info, devices]);

    useDestroy(() => {
        dispatch({ type: 'parsingList/setInfo', payload: [] });
        dispatch({ type: 'parsingList/setDevice', payload: [] });
    });

    /**
     * 面板横向滚动控制
     */
    const onDevWheel = (event: WheelEvent) => {
        const { current } = devRef;
        const { deltaY } = event;
        if (current) {
            current.style.scrollBehavior = 'auto';
            current.scrollLeft += deltaY - 10;
        }
    }

    /**
     * 滚动按钮Click
     */
    const onScrollButtonClick = (to: 'left' | 'right') => {
        const { current } = devRef;
        if (current) {
            current.style.scrollBehavior = 'smooth';
            switch (to) {
                case 'left':
                    current.scrollLeft -= 120;
                    break;
                case 'right':
                    current.scrollLeft += 120;
                    break;
                default:
                    console.warn(`Unknow ${to}`);
            }
        }
    };

    useEffect(() => {
        const { current } = devRef;
        if (current !== null) {
            current.addEventListener('wheel', onDevWheel, { passive: true });
        }
        return () => {
            current?.removeEventListener('wheel', onDevWheel);
        };
    }, []);

    /**
     * 渲染解析列表
     */
    const renderList = () => {

        if (info.length > 0 && devices.length > 0) {
            return devices.map(({ _id }) => {
                const next = info.find(i => i.deviceId === _id);
                return <ParsingDev
                    info={next}
                    devices={devices}
                    key={`PD_${_id}`} />
            });
        } else {
            return <div className="d-empty">
                <Empty
                    description={`暂无解析${devText ?? '设备'}`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        }
    };

    const renderScrollButton = () => {
        if (info.length > 0 && devices.length > 0) {
            return <>
                <div onClick={() => onScrollButtonClick('left')} className="scroll-button left" title="向左滚动">
                    <DoubleLeftOutlined />
                </div>
                <div onClick={() => onScrollButtonClick('right')} className="scroll-button right" title="向右滚动">
                    <DoubleRightOutlined />
                </div>
            </>;
        } else {
            return null;
        }
    }

    return <ListBox>
        <div className="title">
            解析列表
        </div>
        <div ref={devRef} className="dev">
            {renderList()}
        </div>
        {renderScrollButton()}
    </ListBox>;
}

export { ParsingList };