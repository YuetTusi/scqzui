import React, { FC, memo, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Space from 'antd/lib/space';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import Explain from '@/component/explain';
import { SaveForm } from './save-form';
import { AlipayOrderModalProp } from './prop';

const { useForm } = Form;

/**
 * 支付宝云帐单获取
 */
const AlipayOrderModal: FC<AlipayOrderModalProp> = memo(({
    visible,
    cancelHandle,
    saveHandle
}) => {

    const [formRef] = useForm<{ savePath: string }>();

    /**
     * 保存Click
     * @param event 
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        event.preventDefault();
        try {
            const values = await validateFields();
            saveHandle(values);
        } catch (e) {
            console.log(e);
        }
    }

    return <Modal
        footer={[
            <Button onClick={() => cancelHandle()} type="default" key="AOM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={onSaveClick} type="primary" key="AOM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        title="支付宝帐单云取"
        width={600}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        forceRender={true}
    >
        <Space direction="vertical">
            <Explain title="支付宝账单云取提示">
                <ul>
                    <li>支付宝账单获取需要手机联网，可能造成其他App登录状态失效</li>
                    <li>
                        手机联网后选择保存的位置，点击支付宝账单获取，打开支付宝
                        <strong>扫描屏幕中的二维码</strong>，等待完成提示
                    </li>
                    <li>
                        操作过程中，请<strong>不要关闭弹出来的二维码窗口</strong>
                    </li>
                </ul>
            </Explain>
            <SaveForm formRef={formRef} />
        </Space>
    </Modal>
});

AlipayOrderModal.defaultProps = {
    visible: false,
    cancelHandle: () => { }
}

export default AlipayOrderModal;