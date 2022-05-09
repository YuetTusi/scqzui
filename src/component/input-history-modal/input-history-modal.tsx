import React, { FC, useState } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { HistoryList } from './history-list';
import { InputHistoryModalProp } from './prop';
import UserHistory, { HistoryKeys } from '@/utils/user-history';

/**
 * 用户输入项管理框
 */
const InputHistoryModal: FC<InputHistoryModalProp> = ({
    visible,
    closeHandle
}) => {

    const [deviceName, setDeviceName] = useState<string[]>(UserHistory.get(HistoryKeys.HISTORY_DEVICENAME));
    const [deviceHolder, setDeviceHolder] = useState<string[]>(UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER));
    const [mobileNumber, setMobileNumber] = useState<string[]>(UserHistory.get(HistoryKeys.HISTORY_MOBILENUMBER));
    const [deviceNumber, setDeviceNumber] = useState<string[]>(UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER));
    const [unitName, setUnitName] = useState<string[]>(UserHistory.get(HistoryKeys.HISTORY_UNITNAME));

    /**
     * 清空Click
     * @param type Key值
     */
    const onDelClick = (type: HistoryKeys) => {
        Modal.confirm({
            onOk() {
                UserHistory.clear(type);
                switch (type) {
                    case HistoryKeys.HISTORY_DEVICENAME:
                        setDeviceName([]);
                        break;
                    case HistoryKeys.HISTORY_DEVICEHOLDER:
                        setDeviceHolder([]);
                        break;
                    case HistoryKeys.HISTORY_MOBILENUMBER:
                        setMobileNumber([]);
                        break;
                    case HistoryKeys.HISTORY_DEVICENUMBER:
                        setDeviceNumber([]);
                        break;
                    case HistoryKeys.HISTORY_UNITNAME:
                        setUnitName([]);
                        break;
                    default:
                        console.warn('未知LocalStorage Key');
                        break;
                }
                message.destroy();
                message.success('清除成功');
            },
            title: '清空记录',
            content: '确认清空输入历史记录？',
            okText: '是',
            cancelText: '否',
            centered: true
        });
    };

    return <Modal
        footer={[
            <Button
                onClick={closeHandle}
                key="IHM_0">
                <CheckCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        visible={visible}
        title="用户输入历史记录"
        onCancel={closeHandle}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        width={1000}>

        <Row gutter={10}>
            <Col flex={1}>
                <Card
                    extra={<Button onClick={() => onDelClick(HistoryKeys.HISTORY_DEVICENAME)} danger={true} size="small">清除</Button>}
                    title="手机名称"
                    size="small">
                    <HistoryList
                        data={deviceName}
                        prefix={HistoryKeys.HISTORY_DEVICENAME} />
                </Card>
            </Col>
            <Col flex={1}>
                <Card
                    extra={<Button onClick={() => onDelClick(HistoryKeys.HISTORY_DEVICEHOLDER)} danger={true} size="small">清除</Button>}
                    title="持有人"
                    size="small">
                    <HistoryList
                        data={deviceHolder}
                        prefix={HistoryKeys.HISTORY_DEVICEHOLDER} />
                </Card>
            </Col>
            <Col flex={1}>
                <Card
                    extra={<Button onClick={() => onDelClick(HistoryKeys.HISTORY_MOBILENUMBER)} danger={true} size="small">清除</Button>}
                    title="手机号"
                    size="small">
                    <HistoryList
                        data={mobileNumber}
                        prefix={HistoryKeys.HISTORY_MOBILENUMBER} />
                </Card>
            </Col>
            <Col flex={1}>
                <Card
                    extra={<Button onClick={() => onDelClick(HistoryKeys.HISTORY_DEVICENUMBER)} danger={true} size="small">清除</Button>}
                    title="手机编号"
                    size="small">
                    <HistoryList
                        data={deviceNumber}
                        prefix={HistoryKeys.HISTORY_DEVICENUMBER} />
                </Card>
            </Col>
            <Col flex={1}>
                <Card
                    extra={<Button onClick={() => onDelClick(HistoryKeys.HISTORY_UNITNAME)} danger={true} size="small">清除</Button>}
                    title="检验单位"
                    size="small">
                    <HistoryList
                        data={unitName}
                        prefix={HistoryKeys.HISTORY_UNITNAME} />
                </Card>
            </Col>
        </Row>
    </Modal>
};

InputHistoryModal.defaultProps = {
    visible: false
}

export default InputHistoryModal;