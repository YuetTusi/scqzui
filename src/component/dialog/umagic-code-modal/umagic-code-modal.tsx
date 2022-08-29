import React, { FC, useState } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import { UMagicCodeModalBox } from './styled/style';
import { UMagicCodeModalProp } from './prop';

/**
 * 联通验证码输入框
 */
const UMagicCodeModal: FC<UMagicCodeModalProp> = ({ visible, device, closeHandle, okHandle }) => {
    const [code, setCode] = useState<string>('');

    return <Modal
        visible={visible}
        footer={[
            <Button
                key="UCM_0"
                type="default"
                onClick={() => {
                    closeHandle();
                }}>
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={closeHandle}
        title="请输入连接码"
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        closable={true}>
        <UMagicCodeModalBox>
            <div className="control">
                <label>连接码：</label>
                <div className="widget">
                    <Input
                        placeholder="请输入连接码"
                        onChange={(e) => setCode(e.target.value)}
                        value={code}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            okHandle(device?.usb!, code);
                            setCode('');
                        }}>
                        确定
                    </Button>
                </div>
            </div>
        </UMagicCodeModalBox>
    </Modal>;
};

UMagicCodeModal.defaultProps = {
    visible: false,
    closeHandle: () => { },
    okHandle: (usb: number, code: string) => { }
};

export default UMagicCodeModal;
