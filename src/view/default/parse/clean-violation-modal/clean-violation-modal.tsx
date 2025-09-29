import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import { Button, Modal, Descriptions, Empty } from 'antd';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { CleanViolationModalState } from '@/model/default/clean-violation-modal';
import { CleanMessageBox } from './styled/style';
import { CleanViolationModalProp } from './prop';

const { Item } = Descriptions;

/**
 * 清理设备违规数据窗口
 */
const CleanViolationModal: FC<CleanViolationModalProp> = ({ onClear, onCancel }) => {

    const {
        open,
        loading,
        device,
        message
    } = useSelector<StateTree, CleanViolationModalState>(state => state.cleanViolationModal);

    const renderMessage = () => {
        if (message.length === 0) {
            return <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }

        const $li = message.map(
            (item, index) => <li
                key={`CVM_message_${index}`}>
                {item}
            </li>
        );
        return <ul>{$li}</ul>;
    };

    return <Modal
        footer={[
            <Button
                onClick={() => onCancel()}
                disabled={loading}
                type="default"
                key="CVM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => onClear(device)}
                disabled={loading}
                type="primary"
                key="CVM_1">
                {loading ? <SyncOutlined spin={true} /> : <ClearOutlined />}
                <span>清除</span>
            </Button>
        ]}
        open={open}
        onCancel={onCancel}
        title="清除违规数据"
        width={760}
        centered={true}
        closable={false}
        destroyOnClose={false}
        maskClosable={false}
    >
        <Descriptions bordered={true} size="small" column={1}>
            <Item label="设备名称">{device === undefined ? '' : helper.getNameWithoutTime(device.mobileName)}</Item>
            <Item label="持有人">{device?.mobileHolder ?? ''}</Item>
            <Item label="设备编号">{device?.mobileNo ?? ''}</Item>
            <Item label="备注">{device?.note ?? ''}</Item>
            <Item label="品牌">{device?.manufacturer ?? ''}</Item>
            <Item label="型号">{device?.model ?? ''}</Item>
            <Item label="序列号">{device?.serial ?? ''}</Item>
            <Item label="取证时间">{device?.createdAt === undefined ? '' : dayjs(device.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Item>
        </Descriptions>
        <CleanMessageBox>
            <div className="clean-msg">
                <div className="caption">
                    消息
                </div>
                <div className="scroll-dev">
                    {renderMessage()}
                </div>
            </div>
        </CleanMessageBox>
    </Modal>
};

export { CleanViolationModal };