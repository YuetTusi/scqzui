import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import { Form, Modal } from 'antd';
import { helper } from '@/utils/helper';
import { DelLogType } from '@/schema/del-log-type';
import { Split } from '@/component/style-tool';
import { ScrollBox } from './styled/style';
import { MainBox } from '../styled/sub-layout';
import LogTable from './log-table';
import DelAskModal from '../del-ask-modal';
import { SearchForm } from './search-form';
import { FormValue, QuickLogProp } from './prop';

const { useForm } = Form;

/**
 * 快采日志 
 */
const QuickLog: FC<QuickLogProp> = () => {

    const dispatch = useDispatch();
    const [delAskModalVisible, setDelAskModalVisible] = useState<boolean>(false);
    const [formRef] = useForm<FormValue>();


    useEffect(() => {
        query({}, 1);
    }, []);

    /**
     * 查询
     * @param condition 条件
     * @param current 当前页
     * @param pageSize 页尺寸
     */
    const query = (condition: Record<string, any> = {}, current: number = 1, pageSize: number = helper.PAGE_SIZE) =>
        dispatch({
            type: 'quickLogTable/query',
            payload: {
                condition,
                current,
                pageSize
            }
        });

    /**
     * 查询handle
     * @param values 查询条件
     */
    const onSearchHandle = (values: FormValue) => query(values);

    const delHandle = (type: DelLogType) => Modal.confirm({
        onOk() {
            dispatch({ type: 'quickLogTable/deleteByTime', payload: type });
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
                dispatch({ type: 'quickLogTable/dropAllLog' });
            },
            centered: true,
            okText: '是',
            cancelText: '否',
            title: '清理确认',
            content: '日志全部清除且不可恢复，确认清理日志吗？'
        });
    };

    return <MainBox>
        <SearchForm
            formRef={formRef}
            onSearchHandle={onSearchHandle}
            onDelHandle={() => setDelAskModalVisible(true)}
            onClearHandle={onClearHandle} />
        <Split />
        <ScrollBox>
            <LogTable />
        </ScrollBox>
        <DelAskModal
            visible={delAskModalVisible}
            okHandle={delHandle}
            cancelHandle={() => setDelAskModalVisible(false)} />
    </MainBox>;
};

export { QuickLog };