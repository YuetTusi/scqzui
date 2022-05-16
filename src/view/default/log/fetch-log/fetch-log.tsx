import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { DelLogType } from '@/schema/del-log-type';
import { MainBox } from '../styled/sub-layout';
import DelAskModal from '../del-ask-modal';
import { SearchForm } from './search-form';
import LogTable from './log-table';
import { FetchLogProp, FormValue } from './prop';

const { useForm } = Form;

/**
 * 采集日志
 */
const FetchLog: FC<FetchLogProp> = () => {

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
    const onSearchHandle = (values: FormValue) => {
        query(values);
    };

    /**
     * 删除handle
     * @param type 删除类型
     */
    const onDelHandle = () => {
        setDelAskModalVisible(true);
    };

    /**
     * 清除handle
     */
    const onClearHandle = () => {
        Modal.confirm({
            onOk() {
                dispatch({ type: 'fetchLogTable/dropAllData' });
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
    const query = (condition: Record<string, any> = {}, current: number = 1, pageSize: number = 10) =>
        dispatch({
            type: 'fetchLogTable/queryAllFetchLog',
            payload: {
                condition,
                current,
                pageSize
            }
        });


    /**
     * 显示采集记录handle
     */
    const delHandle = (type: DelLogType) => {
        Modal.confirm({
            onOk() {
                dispatch({ type: 'fetchLogTable/deleteFetchLogByTime', payload: type });
                setDelAskModalVisible(false);
            },
            centered: true,
            okText: '是',
            cancelText: '否',
            title: '清理确认',
            content: '日志删除不可恢复，确认清理日志吗？'
        });
    };

    return <MainBox>
        <SearchForm
            formRef={formRef}
            onSearchHandle={onSearchHandle}
            onDelHandle={onDelHandle}
            onClearHandle={onClearHandle} />
        <Split />
        <LogTable formRef={formRef} />
        <DelAskModal
            visible={delAskModalVisible}
            okHandle={delHandle}
            cancelHandle={() => setDelAskModalVisible(false)} />
    </MainBox>;
}

export default FetchLog;