import React, { FC } from 'react';
import { useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { FetchStateModalState } from '@/model/default/fetch-state-modal';
import { FetchStateModalProp } from './prop';
import { ListBox, StatePanel } from './styled/box';


const FetchStateModal: FC<FetchStateModalProp> = ({
    open, device, onCancel
}) => {

    const { data } = useSelector<StateTree, FetchStateModalState>(state =>
        state.fetchStateModal
    );

    const renderDetailItems = () => {
        if (device === undefined || device === null) {
            return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }

        const { usb } = device!;
        if (data[usb!] === undefined || data[usb!] === null) {
            return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }

        const { items } = data[usb!];
        if (items && items.length > 0) {
            return items.map(i => <li className="state-list-item" key={`FSM_${usb}_${i.name}`}>
                <label>{i.name}</label>：<span>{i.value}</span>
            </li>);
        } else {
            return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    };

    return <Modal
        footer={[
            <Button onClick={() => onCancel()} key="FSM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        open={open}
        onCancel={onCancel}
        title="采集状态"
        width={600}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        className="zero-padding-body">
        <StatePanel>
            <ListBox>
                {renderDetailItems()}
            </ListBox>
        </StatePanel>

    </Modal>
};

export { FetchStateModal };