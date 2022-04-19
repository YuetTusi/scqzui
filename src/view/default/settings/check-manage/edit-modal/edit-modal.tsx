import React, { FC, useEffect, useState, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { TableName } from '@/schema/table-name';
import { FetchData } from '@/schema/fetch-data';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { EditModalProp } from './prop';

const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

const splitName = (name?: string): [string, string] => {
    if (name === undefined) {
        return ['', ''];
    } else if (name.includes('_')) {
        const [n, timestamp] = name.split('_');
        return [n, timestamp];
    } else {
        const [n] = name.split('_');
        return [n, helper.timestamp()];
    }
};

/**
 * 编辑点验记录
 */
const EditModal: FC<EditModalProp> = ({
    visible,
    serial,
    saveHandle,
    cancelHandle
}) => {
    const [data, setData] = useState<FetchData>();
    const [formRef] = useForm<FetchData>();
    useEffect(() => {
        const db = getDb<FetchData>(TableName.CheckData);
        if (visible) {
            (async () => {
                try {
                    const next = await db.findOne({ serial });
                    setData(next);
                } catch (error) {
                    setData(void 0);
                    console.log(`查询点验记录失败(serial:${serial})`);
                    console.warn(error);
                }
            })();
        }
    }, [visible]);

    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (data !== undefined) {
            setFieldsValue({
                ...data,
                mobileName: (data?.mobileName ?? '').split('_')[0]
            });
        }
    }, [data]);

    /**
     * 确定Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        event.preventDefault();
        try {
            const values = await validateFields();
            const [, timestamp] = splitName(data?.mobileName);
            const next: FetchData = {
                ...data,
                mobileHolder: values.mobileHolder,
                credential: values.credential,
                mobileName: values.mobileName + '_' + timestamp,
                note: values.note,
                mobileNo: values.mobileNo
            };
            saveHandle(next);
        } catch (error) {
            console.clear();
            console.warn();
        }
    };

    /**
     * 取消Click
     */
    const onCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        cancelHandle();
    };

    return <Modal
        footer={[
            <Button
                onClick={onCancelClick}
                type="default"
                key="CE_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onSaveClick}
                type="primary"
                key="CE_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        width={620}
        title="编辑"
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        forceRender={true}
    >
        <Form form={formRef} {...formItemLayout}>
            <Item
                rules={[{ required: true, message: '请填写手机名称' }]}
                name="mobileHolder"
                label="姓名">
                <Input />
            </Item>
            <Item
                rules={[{ required: true, message: '请填写身份证/军官证号' }]}
                name="credential"
                label="身份证/军官证号">
                <Input />
            </Item>
            <Item
                rules={[{ required: true, message: '请填写手机名称' }]}
                name="mobileName"
                label="手机名称">
                <Input />
            </Item>
            <Item
                rules={[{ required: true, message: '请填写设备手机号' }]}
                name="note"
                label="设备手机号">
                <Input />
            </Item>
            <Item
                name="mobileNo"
                label="手机编号">
                <Input />
            </Item>
        </Form>
    </Modal>;
}

EditModal.defaultProps = {
    visible: false,
    serial: '',
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default EditModal;