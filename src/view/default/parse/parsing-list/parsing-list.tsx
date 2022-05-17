import React, { FC, MouseEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Progress from 'antd/lib/progress';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { ParsingListState } from '@/model/default/parsing-list';
import ParseDetail from '@/schema/parse-detail';
import DeviceType from '@/schema/device-type';
import { ListBox } from './styled/style';

const { devText } = helper.readConf()!;

/**
 * 正在解析的设备列表
 * +---+
 * |###|
 * +---+
 * | | |
 * +---+
 */
const ParsingDev: FC<{ info: ParseDetail, devices: DeviceType[] }> = ({ info, devices }) => {

    const dispatch = useDispatch();
    const { curinfo, curprogress, deviceId, caseId } = info;

    /**
     * 解析中设备Click
     */
    const onItemClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        dispatch({ type: 'parseCase/setSelectedRowKeys', payload: [caseId] });
        dispatch({ type: 'parseDev/setCaseId', payload: caseId });
        dispatch({ type: 'parseDev/setExpandedRowKeys', payload: [deviceId] }); //点击自动展开设备表格行
    };

    const renderLi = () => {
        const dev = devices.find(item => item._id === deviceId);
        return <ul>
            <li>
                <label>{`${devText ?? '设备'}名称`}</label>
                <span>{dev?.mobileName === undefined ? '' : dev?.mobileName.split('_')[0]}</span>
            </li>
            <li>
                <label>持有人</label>
                <span>{dev?.mobileHolder ?? ''}</span>
            </li>
            <li>
                <label>编号</label>
                <span>{dev?.mobileNo ?? ''}</span>
            </li>
            <li>
                <label>备注</label>
                <span>{dev?.note ?? ''}</span>
            </li>
        </ul>;
    }

    const progFormatter = (percent?: number) => {
        if (percent === 100) {
            return <span>完成</span>;
        } else {
            return <span>{`${percent}%`}</span>;
        }
    };

    return <div className="d-item" onClick={onItemClick}>
        <div className="prog">
            <Progress
                percent={curprogress}
                format={progFormatter}
                type="circle"
                strokeColor="#26e5dc" />
        </div>
        <div className="info">
            <div className="live">
                {curinfo ?? '暂无进度消息'}
            </div>
            {renderLi()}
        </div>
    </div>;
};

/**
 * 进度列表
 */
const ParsingList: FC<{}> = () => {

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
    }, [info]);

    useEffect(() => {
        return () => {
            dispatch({ type: 'parsingList/setInfo', payload: [] });
            dispatch({ type: 'parsingList/setDevice', payload: [] });
        };
    }, []);

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

    /**
     * 渲染解析列表
     */
    const renderList = () => {

        if (info && info.length > 0) {
            return info.map((item) => <ParsingDev
                info={item}
                devices={devices}
                key={`PD_${item.deviceId}`} />);
        } else {
            return <div className="d-empty">
                <Empty
                    description={`暂无解析${devText ?? '设备'}`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        }
    };

    return <ListBox>
        <div className="title">
            解析列表
        </div>
        <div ref={devRef} className="dev">
            {renderList()}
        </div>
    </ListBox>;
}

export { ParsingList };