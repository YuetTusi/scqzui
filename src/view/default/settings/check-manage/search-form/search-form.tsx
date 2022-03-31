import React, { FC, MouseEvent } from 'react';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Form, { FormInstance } from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';

const { Item } = Form;

interface FormValue {
    /**
     * 姓名（持有人）
     */
    mobileHolder: string,
}

interface SearchFormProp {
    formRef: FormInstance<FormValue>,
    onSearchHandle: () => void,
    onDelHandle: () => void
}

const SearchForm: FC<SearchFormProp> = ({
    formRef,
    onSearchHandle,
    onDelHandle
}) => {

    /**
     * 查询Click
     */
    const onSearchClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onSearchHandle();
    };

    /**
     * 删除Click
     */
    const onDelClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onDelHandle();
    };

    return <Form form={formRef} layout="inline">
        <Item
            label="姓名"
            name="mobileHolder">
            <Input />
        </Item>
        <Item>
            <Button
                onClick={onSearchClick}
                type="primary">
                <SearchOutlined />
                <span>查询</span>
            </Button>
        </Item>
        <Item style={{ marginRight: 0 }}>
            <Button
                onClick={onDelClick}
                type="primary"
                danger={true}>
                <DeleteOutlined />
                <span>全部删除</span>
            </Button>
        </Item>
    </Form>;
};

export { SearchForm, FormValue };