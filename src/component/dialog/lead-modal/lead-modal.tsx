import React, { FC } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { LeadModalProp } from './prop';

const LeadModal: FC<LeadModalProp> = ({
    visible, device, closeHandle, okHandle
}) => {

    return <Modal
        footer={[
            <Button onClick={closeHandle} key="LM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={okHandle} key="LM_1">
                <CloseCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={closeHandle}
        open={visible}
        title="提示"
        maskClosable={false}
        centered={true}
        destroyOnClose={true}
    >

    </Modal>;
};

export { LeadModal };