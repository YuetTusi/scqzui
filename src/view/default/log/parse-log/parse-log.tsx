import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { DelLogType } from '@/schema/del-log-type';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { MainBox } from '../styled/sub-layout';
import LogTable from './log-table';
import { SearchForm } from './search-form';
import DelAskModal from '../del-ask-modal';
import { FormValue, ParseLogProp } from './prop';

const { useForm } = Form;

/**
 * 解析日志
 */
const ParseLog: FC<ParseLogProp> = () => {

    const dispatch = useDispatch();
    const [delAskModalVisible, setDelAskModalVisible] = useState<boolean>(false);
    const [formRef] = useForm<FormValue>();

    useEffect(() => {
        query({}, 1, helper.PAGE_SIZE);
    }, []);

    /**
     * 查询handle
     * @param values 查询条件
     */
    const onSearchHandle = (values: FormValue) => query(values);

    const delHandle = (type: DelLogType) => Modal.confirm({
        onOk() {
            dispatch({ type: 'parseLogTable/deleteParseLogByTime', payload: type });
            setDelAskModalVisible(false);
        },
        centered: true,
        okText: '是',
        cancelText: '否',
        title: '清理确认',
        content: '日志删除不可恢复，确认清理日志吗？'
    });

    /**
     * 清除handle
     */
    const onClearHandle = () => {
        Modal.confirm({
            onOk() {
                dispatch({ type: 'parseLogTable/dropAllLog' });
            },
            centered: true,
            okText: '是',
            cancelText: '否',
            title: '清理确认',
            content: '日志全部清除且不可恢复，确认清理日志吗？'
        });
    };

    /**
     * 查询
     * @param condition 条件
     * @param current 当前页
     * @param pageSize 页尺寸
     */
    const query = (condition: Record<string, any> = {}, current: number = 1, pageSize: number = helper.PAGE_SIZE) =>
        dispatch({
            type: 'parseLogTable/queryParseLog',
            payload: {
                condition,
                current,
                pageSize
            }
        });

    return <MainBox>
        <SearchForm
            formRef={formRef}
            onSearchHandle={onSearchHandle}
            onDelHandle={() => setDelAskModalVisible(true)}
            onClearHandle={onClearHandle} />
        <Split />
        <LogTable formRef={formRef} />
        <DelAskModal
            visible={delAskModalVisible}
            okHandle={delHandle}
            cancelHandle={() => setDelAskModalVisible(false)} />
    </MainBox>;
}

export default ParseLog;