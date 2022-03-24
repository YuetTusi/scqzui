import React, { FC } from 'react';
import dayjs from 'dayjs';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { ProgressType } from '@/schema/fetch-record';
import { HistoryModalProp } from './prop';
import { FetchRecordBox } from './styled/style';

/**
 * 渲染时间
 * @param time 时间对象
 */
const renderTime = (time: Date) => {
    if (helper.isNullOrUndefined(time)) {
        return '- - -';
    } else {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
};

/**
 * 采集记录框
 */
const HistoryModal: FC<HistoryModalProp> = ({ title, visible, data, cancelHandle }) => {
    /**
     * 渲染记录数据
     */
    const renderData = () => {
        if (helper.isNullOrUndefined(data) || data?.length === 0) {
            return (
                <div className="middle">
                    <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            );
        } else {
            return (
                <ul>
                    {data?.map(({ type, info, time }, index) => {
                        switch (type) {
                            case ProgressType.Normal:
                                return (
                                    <li key={`FR_${index}`}>
                                        <label>【{renderTime(time)}】</label>
                                        <span style={{ color: '#222' }}>{info}</span>
                                    </li>
                                );
                            case ProgressType.Warning:
                                return (
                                    <li key={`FR_${index}`}>
                                        <label>【{renderTime(time)}】</label>
                                        <span style={{ color: '#dc143c' }}>{info}</span>
                                    </li>
                                );
                            case ProgressType.Message:
                                return (
                                    <li key={`FR_${index}`}>
                                        <label>【{renderTime(time)}】</label>
                                        <span style={{ color: '#f9ca24' }}>{info}</span>
                                    </li>
                                );
                            default:
                                return (
                                    <li key={`FR_${index}`}>
                                        <label>【{renderTime(time)}】</label>
                                        <span style={{ color: '#222' }}>{info}</span>
                                    </li>
                                );
                        }
                    })}
                </ul>
            );
        }
    };

    return (
        <Modal
            visible={visible}
            footer={[
                <Button type="default" onClick={cancelHandle} key="FH_0">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>
            ]}
            onCancel={cancelHandle}
            title={title}
            width={800}
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            className="zero-padding-body">
            <FetchRecordBox>
                <div className="list-block">{renderData()}</div>
            </FetchRecordBox>
        </Modal>
    );
};

HistoryModal.defaultProps = {
    visible: false,
    data: [],
    title: '采集记录',
    cancelHandle: () => { }
};

export { HistoryModal };