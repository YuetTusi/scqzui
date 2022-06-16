import React, { FC, MouseEvent } from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { AllowCaseName } from '@/utils/regex';
import { NewCategoryModalProp } from './prop';

const { Item, useForm } = Form;

/**
 * 新键关键词分类Modal
 */
const NewCategoryModal: FC<NewCategoryModalProp> = ({
    visible,
    loading,
    saveHandle,
    cancelHandle
}) => {

    const [formRef] = useForm<{ name: string }>();

    /**
    * 保存Click
    */
    const onSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        e.preventDefault();

        try {
            const values = await validateFields();
            saveHandle(values.name);
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 取消Click
     */
    const onCancelClick = () => {
        formRef.resetFields();
        cancelHandle();
    };

    return <Modal
        footer={[
            <Button
                onClick={() => onCancelClick()}
                type="default"
                key="ACM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onSaveClick}
                disabled={loading}
                type="primary"
                key="ACM_1">
                {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                <span>确定</span>
            </Button>
        ]}
        visible={visible}
        onCancel={onCancelClick}
        title="新建关键词分类"
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}
    >
        <Form form={formRef}>
            <Item
                rules={[
                    { required: true, message: '请输入关键词分类' },
                    { pattern: AllowCaseName, message: '不允许输入非法字符' }
                ]}
                name="name"
                label="关键词分类">
                <Input placeholder="分类名称，如：涉借贷，涉诈骗" />
            </Item>
        </Form>
    </Modal>
};

NewCategoryModal.defaultProps = {
    visible: false,
    loading: false,
    cancelHandle: () => { },
    saveHandle: () => { }
};

export default NewCategoryModal;