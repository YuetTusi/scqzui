import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useLocation } from 'dva';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import DatePicker from 'antd/lib/date-picker';
import Auth from '@/component/auth';
import { helper } from '@/utils/helper';
import { SearchFormBox } from '../styled/search-form';
import { SearchFormProp } from './prop';

const { fetchText } = helper.readConf()!;
const { Item } = Form;
const Datepicker = DatePicker as any;
/**
 * 查询表单
 */
const SearchForm: FC<SearchFormProp> = ({ formRef, onSearchHandle, onDelHandle, onClearHandle }) => {

    const { search } = useLocation<{ admin: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        setIsAdmin(new URLSearchParams(search).get('admin') === '1');
    }, [search]);

    /**
     * 查询
     */
    const onSearch = (event: MouseEvent<HTMLButtonElement>) => {
        const { getFieldsValue } = formRef;
        event.preventDefault();
        const values = getFieldsValue();
        onSearchHandle(values);
    };

    /**
     * 删除
     */
    const onDel = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onDelHandle();
    };

    /**
     * 全部删除
     */
    const onClear = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onClearHandle();
    };

    return <SearchFormBox>
        <Form form={formRef} layout="inline">
            <Item name="start" label={`${fetchText ?? '取证'}时间 起`}>
                <Datepicker
                    showTime={true}
                    placeholder="请选择时间"
                />
            </Item>
            <Item name="end" label="止">
                <Datepicker
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
            <Auth deny={!isAdmin}>
                <Button type="primary" danger={true} onClick={onClear}>
                    <DeleteOutlined />
                    <span>全部清除</span>
                </Button>
            </Auth>
        </div>
    </SearchFormBox>
}

SearchForm.defaultProps = {
    onDelHandle: () => { },
    onSearchHandle: () => { }
}

export { SearchForm };