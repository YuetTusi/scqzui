import React, { FC } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { ImageBox } from './styled/styled';
import { IMEIModalProp } from './prop';
import step1 from './styled/image/step1.jpg';
import step2 from './styled/image/step2.jpg';

const IMEIModal: FC<IMEIModalProp> = ({ open, onCancel }) => {

    return <Modal
        footer={[
            <Button type="default" onClick={onCancel} key="IMEIM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={onCancel}
        open={open}
        width={776}
        title="获取IMEI/MEID"
        centered={true}
        maskClosable={false}
        className="zero-padding-body">
        <ImageBox>
            <div className="msg">
                该设备无法自动获取IMEI/MEID信息，请参照如下步骤手动获取：
            </div>
            <div className="steps">
                <div className="step">
                    <img src={step1} />
                    <span>
                        <strong>第1步</strong>
                        &nbsp;打开手机播号键盘，输入
                        <strong className="warn">*#06#</strong>
                    </span>
                </div>
                <div className="step">
                    <img src={step2} />
                    <span>
                        <strong>第2步</strong>
                        &nbsp;屏幕出现IMEI/MEID等信息，正确输入即可
                    </span>
                </div>
            </div>
        </ImageBox>
    </Modal>;
};

export { IMEIModal };