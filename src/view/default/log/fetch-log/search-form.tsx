import React, { FC, MouseEvent } from 'react';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import DatePicker from 'antd/lib/date-picker';
import { SearchFormBox } from '../styled/search-form';
import { SearchFormProp } from './prop';

const { Item } = Form;
/**
 * 查询表单
 */
const SearchForm: FC<SearchFormProp> = ({ formRef, onSearchHandle, onDelHandle }) => {


    const onSearch = (event: MouseEvent<HTMLButtonElement>) => {
        const { getFieldsValue } = formRef;
        event.preventDefault();
        const values = getFieldsValue();
        onSearchHandle(values);
    };

    const onDel = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onDelHandle();
    };

    return <SearchFormBox>
        <Form form={formRef} layout="inline">
            <Item name="start" label="采集时间 起">
                <DatePicker
                    showTime={true}
                    placeholder="请选择时间"
                />
            </Item>
            <Item name="end" label="止">
                <DatePicker
                    showTime={true}
                    placeholder="请选择时间"
                />
            </Item>
            <Item>
                <Button onClick={onSearch} type="primary">
                    <SearchOutlined />
                    <span>查询</span>
                </Button>
            </Item>
        </Form>
        <div className="fn">
            <Button type="primary" onClick={onDel}>
                <DeleteOutlined />
                <span>清理</span>
            </Button>
            {/* <Button type="primary" danger={true} onClick={onDel}>
                <DeleteOutlined />
                <span>全部清除</span>
            </Button> */}
        </div>
    </SearchFormBox>
}

SearchForm.defaultProps = {
    onDelHandle: () => { },
    onSearchHandle: () => { }
}

export { SearchForm };