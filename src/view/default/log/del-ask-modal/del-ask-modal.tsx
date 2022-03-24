import styled from 'styled-components';
import React, { FC, useState } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { DelLogType } from '@/schema/del-log-type';
import Select from 'antd/lib/select';

const { Option } = Select;

const CenterBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const DelAskModal: FC<{
    visible: boolean,
    okHandle: (data: DelLogType) => void,
    cancelHandle: () => void
}> = ({ visible, okHandle, cancelHandle }) => {


    const [delType, setDelType] = useState<DelLogType>(DelLogType.TwoYearsAgo);

    /**
     * 删除时段Change
     */
    const onChange = (value: DelLogType) =>
        setDelType(value);

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="DAM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => okHandle(delType)}
                type="primary"
                key="DAM_1">
                <CheckCircleOutlined />
                <span>删除</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        title="清理日志">
        <CenterBox>
            <label>清理时段：</label>
            <Select<DelLogType>
                value={delType}
                onChange={onChange}
                style={{ width: 260 }}>
                <Option value={DelLogType.TwoYearsAgo}>两年前</Option>
                <Option value={DelLogType.OneYearAgo}>一年前</Option>
                <Option value={DelLogType.SixMonthsAgo}>六个月前</Option>
            </Select>
        </CenterBox>
    </Modal>
};

DelAskModal.defaultProps = {
    visible: false,
    okHandle: () => { },
    cancelHandle: () => { }
};

export default DelAskModal;