import React, { FC, memo, useEffect } from 'react';
import throttle from 'lodash/throttle';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Officer from '@/schema/officer';
import { TableName } from '@/schema/table-name';
import { PoliceNo } from '@/utils/regex';
import { EditFormProp } from './prop';
import { getDb } from '@/utils/db';

const { Item } = Form;

/**
 * 编辑表单
 */
const EditForm: FC<EditFormProp> = ({ formRef, data }) => {

    useEffect(() => {
        if (data) {
            formRef.setFieldsValue(data);
        }
    }, [data]);

    /**
     * 校验编号重复
     */
    const isExistNo = throttle(async (rule: any, value: string) => {
        const db = getDb<Officer>(TableName.Officer);
        try {
            let next = await db.find({
                no: value
            });
            if (data !== undefined) {
                next = next.filter((i) => i._id !== data._id);
            }
            if (next.length !== 0) {
                throw new Error('编号已存在');
            }
        } catch (error) {
            throw error;
        }
    }, 400);

    return (
        <Form
            form={formRef}
            style={{ width: '400px' }}
            layout="vertical"
        >
            <Item rules={[
                { required: true, message: '请填写姓名' }
            ]}
                name="name"
                label="姓名">
                <Input maxLength={20} />
            </Item>
            <Item rules={[
                { required: true, message: '请填写编号' },
                { pattern: PoliceNo, message: '6位数字' },
                { validator: isExistNo, message: '编号已存在' }
            ]}
                name="no"
                label="编号">
                <Input placeholder="6位数字" />
            </Item>
        </Form>
    );
};

export default memo(EditForm);
