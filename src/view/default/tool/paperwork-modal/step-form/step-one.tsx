import React, { FC } from 'react';
import { Input, Form } from 'antd';
import { StepProp } from './prop';

const { Item } = Form;

const StepOne: FC<StepProp> = ({ visible, formRef }) => {

    return <div style={{ display: visible ? 'block' : 'none' }}>
        <Form form={formRef} layout="vertical">
            <Item name="caseName" label="案件名称">
                <Input />
            </Item>
            <Item name="caseNo" label="案件编号">
                <Input />
            </Item>
            <Item name="reportName" label="报告名称">
                <Input />
            </Item>
            <Item name="reportNo" label="报告编号">
                <Input />
            </Item>
            <Item name="mobileHolder" label="持有人">
                <Input />
            </Item>
            <Item name="savePath" label="保存路径">
                <Input readOnly={true} addonAfter="..." />
            </Item>
        </Form>
    </div>;
};

export { StepOne };