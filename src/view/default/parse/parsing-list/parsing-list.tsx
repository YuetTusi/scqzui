import React, { FC, useEffect, useRef } from 'react';
import Empty from 'antd/lib/empty';
import Progress from 'antd/lib/progress';
import { ListBox } from './styled/style';


const ParsingDev: FC<{}> = () => {
    return <div className="d-item">
        <div className="prog">
            <Progress percent={33.3} type="circle" status="normal" strokeColor="#26e5dc" />
        </div>
        <div className="info">
            <div className="live">
                暂无进度消息
            </div>
            <ul>
                <li>
                    <label>手机名称</label>
                    <span>OnePlusR9</span>
                </li>
                <li>
                    <label>手机持有人</label>
                    <span>习包</span>
                </li>
                <li>
                    <label>编号</label>
                    <span>001</span>
                </li>
                <li>
                    <label>备注</label>
                    <span>001</span>
                </li>
            </ul>
        </div>
    </div>;
};

const ParsingList: FC<{}> = () => {

    const devRef = useRef<HTMLDivElement>(null);

    /**
     * 面板横向滚动控制
     */
    const onDevWheel = (event: WheelEvent) => {
        event.preventDefault();
        const { current } = devRef;
        const { deltaY } = event;
        if (current) {
            current.scrollLeft += deltaY - 10;
        }
    }


    useEffect(() => {
        const { current } = devRef;
        if (current !== null) {
            current.addEventListener('wheel', onDevWheel);
        }
        return () => {
            current?.removeEventListener('wheel', onDevWheel);
        };
    }, []);

    return <ListBox>
        <div className="title">
            解析列表
        </div>
        <div ref={devRef} className="dev">
            {/* <div className="d-empty">
                <Empty description="暂无解析设备" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div> */}
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
            <ParsingDev />
        </div>
        <div className="mask-split" />
    </ListBox>;
}

export { ParsingList };