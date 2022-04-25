import React, { FC } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { EventDescModalProp } from './prop';
import { useQuickEvent } from '@/hook';

/**
 * 点验案件详情框
 */
const EventDescModal: FC<EventDescModalProp> = ({
    visible,
    id,
    cancelHandle
}) => {

    const data = useQuickEvent(id);

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={false}
        title="点验案件详情"
    >
        {JSON.stringify(data)}
    </Modal>
};

export default EventDescModal;