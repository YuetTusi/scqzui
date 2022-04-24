import React, { FC, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { QuickBox } from './styled/style';
import EventList from './quick-event-list';
import EditQuickEventModal from './edit-quick-event-modal';

const Quick: FC<{}> = () => {

    const dispatch = useDispatch();

    /**
     * 添加Click
     */
    const onAddClick = (event: MouseEvent) => {
        event.preventDefault();
        dispatch({ type: 'editQuickEventModal/setVisible', payload: true });
    };

    return <SubLayout title="快速点验">
        <QuickBox>
            <div className="quick-content">
                <div className="search-bar">
                    <Button onClick={onAddClick} type="primary">
                        <PlusCircleOutlined />
                        <span>添加点验</span>
                    </Button>
                </div>
                <Split />
                <Row gutter={10}>
                    <Col flex="420px">
                        <div className="sort-box">
                            <div className="title">
                                点验案件
                            </div>
                            <div className="content">
                                <EventList />
                            </div>
                        </div>
                    </Col>
                    <Col flex="auto">
                        <div className="sort-box">
                            <div className="title">
                                设备
                            </div>
                            <div className="content">
                                Device
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </QuickBox>
        <EditQuickEventModal />
    </SubLayout>;
}

export default Quick;