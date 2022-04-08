import React, { FC, useState } from 'react';
import { useDispatch } from 'dva';
import Modal from 'antd/lib/modal';
import { useForm } from 'antd/lib/form/Form';
import { Split } from '@/component/style-tool';
import { DelLogType } from '@/schema/del-log-type';
import { MainBox } from '../styled/sub-layout';
import LogTable from './log-table';
import { SearchForm } from './search-form';
import DetailModal from './detail-modal';
import DelAskModal from '../del-ask-modal';
import { CloudLogProp, FormValue } from './prop';

/**
 * 云取日志
 */
const CloudLog: FC<CloudLogProp> = () => {

    const dispatch = useDispatch();
    const [delAskModalVisible, setDelAskModalVisible] = useState<boolean>(false);
    const [formRef] = useForm<FormValue>();

    const onSearch = (values: FormValue) => {
        dispatch({
            type: 'cloudLogTable/query', payload: {
                condition: values,
                current: 1
            }
        });
    };

    const onDel = () => {
        setDelAskModalVisible(true);
    };

    const delHandle = (type: DelLogType) => Modal.confirm({
        onOk() {
            dispatch({ type: 'cloudLogTable/del', payload: type });
            setDelAskModalVisible(false);
        },
        centered: true,
        okText: '是',
        cancelText: '否',
        title: '清理确认',
        content: '日志删除不可恢复，确认清理日志吗？'
    });;

    /**
     * 关闭详情框
     */
    const cancelHandle = () => {
        dispatch({ type: 'cloudLogModal/setVisible', payload: false });
        dispatch({ type: 'cloudLogModal/setCloudApps', payload: [] });
    };

    return <MainBox>
        <SearchForm
            onSearchHandle={onSearch}
            onDelHandle={onDel}
            formRef={formRef} />
        <Split />
        <LogTable formRef={formRef} />
        <DetailModal
            cancelHandle={cancelHandle} />
        <DelAskModal
            visible={delAskModalVisible}
            okHandle={delHandle}
            cancelHandle={() => setDelAskModalVisible(false)} />
    </MainBox>;
}

export default CloudLog;