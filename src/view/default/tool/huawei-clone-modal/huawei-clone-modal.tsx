import debounce from 'lodash/debounce';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { MouseEvent, FC } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { HuaweiCloneModalProp } from './prop';
import Explain from '@/component/explain';

const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 }
};

/**
 * 华为手机克隆弹框
 */
const HuaweiCloneModal: FC<HuaweiCloneModalProp> = ({ visible, onOk, onCancel }) => {

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
        title="华为手机克隆"
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}
    >
        <Explain title="操作提示">
            <ul>
                <li>选择数据保存目录</li>
                <li>请创建热点并用华为手机连接，名称形如<strong>TAS-AL00%8888%CloudClone</strong>（其中文字<strong>8888</strong>可自行定义）</li>
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

export default HuaweiCloneModal;