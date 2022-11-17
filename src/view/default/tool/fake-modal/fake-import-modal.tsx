import debounce from 'lodash/debounce';
import { OpenDialogReturnValue, ipcRenderer } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';

const { Item, useForm } = Form;

const FakeImportModal: FC<{
    visible: boolean,
    onCloseClick: (visible: boolean) => void
}> = ({ visible, onCloseClick }) => {

    const [formRef] = useForm<{ fakeDir: string }>();
    const [defPath, setDefPath] = useState('');

    useEffect(() => {
        ipcRenderer
            .invoke('get-path', 'documents')
            .then(p => setDefPath(p));
    }, [visible]);

    /**
     * 案件/检材选择
     * @param {boolean} isCase 是否是案件
     */
    const dirSelectHandle = debounce(
        async () => {
            const { setFieldsValue } = formRef;
            const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                title: '请选择目录',
                properties: ['openDirectory'],
            });

            if (filePaths.length > 0) {
                console.log(filePaths);
                setFieldsValue({ fakeDir: filePaths[0] })
            }
        },
        400,
        { leading: true, trailing: false }
    );

    return <Modal
        footer={[
            <Button onClick={() => {
                formRef.resetFields();
                onCloseClick(false);
            }} type="default" key="FIM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={async () => {
                try {
                    await formRef.validateFields();
                    onCloseClick(true);
                    message.success('正在导入检材...');
                } catch (error) {
                    console.warn(error);
                }
            }} type="primary" key="FIM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={() => {
            formRef.resetFields();
            onCloseClick(false);
        }}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        title="导入检材">
        <Form form={formRef} layout="vertical">
            <Item
                rules={[
                    { required: true, message: '请选择检材目录' }
                ]}
                initialValue={defPath}
                name="fakeDir"
                label="检材目录">
                <Input
                    onClick={() => dirSelectHandle()}
                    readOnly={true}
                    placeholder="请选择检材目录" />
            </Item>
        </Form>
    </Modal>
};

export { FakeImportModal };