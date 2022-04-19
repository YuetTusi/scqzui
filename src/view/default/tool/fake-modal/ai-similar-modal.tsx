import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import debounce from 'lodash/debounce';

const { Item, useForm } = Form;

/**
 * AI造假
 */

const AiSimilarModal: FC<{
    visible: boolean,
    closeHandle: () => void
}> = ({
    visible,
    closeHandle
}) => {

        const [formRef] = useForm<any>();

        const onCloseClick = async (valid: boolean) => {
            const { validateFields } = formRef;
            if (valid) {
                try {
                    await validateFields();
                    message.info('正在进行AI分析...');
                    closeHandle();
                } catch (error) {
                    console.clear();
                }
            } else {
                closeHandle();
            }
        };

        /**
         * 案件/检材选择
         * @param {boolean} isCase 是否是案件
         */
        const dirSelectHandle = debounce(
            async (field: string) => {
                const { setFieldsValue } = formRef;
                const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                    title: '请选择目录',
                    properties: ['openDirectory'],
                });

                if (filePaths.length > 0) {
                    console.log(filePaths);
                    setFieldsValue({ [field]: filePaths[0] })
                }
            },
            400,
            { leading: true, trailing: false }
        );

        return <Modal
            footer={[
                <Button onClick={() => onCloseClick(false)} type="default" key="ASM_0">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Button onClick={() => onCloseClick(true)} type="primary" key="ASM_1">
                    <CheckCircleOutlined />
                    <span>确定</span>
                </Button>,
            ]}
            visible={visible}
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            forceRender={true}
            title="AI相似人像查看">
            <Form form={formRef} layout="vertical">
                <Item
                    rules={[
                        { required: true, message: '请选择人像图片' }
                    ]}
                    name="n1"
                    label="人像图片">
                    <Input
                        onClick={() => dirSelectHandle('n1')}
                        readOnly={true}
                        placeholder="请选择人像目录" />
                </Item>
                <Item
                    rules={[
                        { required: true, message: '请选择检材数据' }
                    ]}
                    name="n2"
                    label="检材数据">
                    <Input
                        onClick={() => dirSelectHandle('n2')}
                        readOnly={true}
                        placeholder="请选择检材目录" />
                </Item>
            </Form>
        </Modal>;
    }

AiSimilarModal.defaultProps = {
    visible: false
}

export { AiSimilarModal };