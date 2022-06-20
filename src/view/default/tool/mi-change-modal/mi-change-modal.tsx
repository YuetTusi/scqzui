import debounce from 'lodash/debounce';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { MouseEvent, FC } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { MiChangeModalProp } from './prop';
import Explain from '@/component/explain';

const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 }
};

/**
 * 小米换机采集弹框
 */
const MiChangeModal: FC<MiChangeModalProp> = ({ visible, onOk, onCancel }) => {

    const [formRef] = useForm<{ targetPath: string }>();

    /**
     * 云帐单保存目录Handle
     */
    const selectSaveHandle = debounce(
        (event: MouseEvent<HTMLInputElement>) => {
            const { setFieldsValue } = formRef;
            ipcRenderer
                .invoke('open-dialog', {
                    properties: ['openDirectory']
                })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths && val.filePaths.length > 0) {
                        setFieldsValue({ targetPath: val.filePaths[0] });
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    const formSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            onOk(values.targetPath);
            reset();
        } catch (error) {
            console.warn(error);
        }
    };

    const reset = () => formRef.resetFields();

    return <Modal
        footer={[
            <Button onClick={() => {
                onCancel();
                reset();
            }} key="MCM_0" type="default">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={formSubmit} key="MCM_1" type="primary">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={onCancel}
        visible={visible}
        title="小米换机采集"
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}
        className="mi-change-modal-root"
    >
        <Explain title="小米换机采集提示">
            <ul>
                <li>选择数据保存目录</li>
                <li>使用小米手机连接热点：<strong>abco_apbc5G_MI</strong></li>
                <li>打开小米换机，点击<strong>旧手机</strong>，选择热点<strong>abco_apbc5G_MI</strong>开始采集</li>
            </ul>
        </Explain>
        <div style={{ marginTop: '10px' }}>
            <Form form={formRef} {...formItemLayout}>
                <Item
                    rules={[
                        { required: true, message: '请选保存目录' }
                    ]}
                    name="targetPath"
                    label="保存目录"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}>
                    <Input
                        readOnly={true}
                        onClick={selectSaveHandle}
                    />
                </Item>
            </Form>
        </div>
    </Modal>
};

export default MiChangeModal;