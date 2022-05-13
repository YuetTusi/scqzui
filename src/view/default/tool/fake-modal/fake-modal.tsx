
import random from 'lodash/random';
import React from 'react';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Modal from 'antd/lib/modal';

const mockTime = random(1000, 2500, false);

/**
 * 造假
 * @param brand 品牌
 */
const fakeModal = (brand: string) => {

    const handle = Modal.info({
        title: '正在检测',
        content: '正在检测连接，请稍等...',
        okText: '确定',
        icon: <LoadingOutlined />,
        centered: true,
        okButtonProps: {
            disabled: true
        }
    });
    setTimeout(() => {
        handle.update((prev) => ({
            ...prev,
            content: `未检测到${brand}设备`,
            icon: <InfoCircleOutlined />,
            okButtonProps: {
                disabled: false
            }
        }));
    }, mockTime);
};

export { fakeModal };