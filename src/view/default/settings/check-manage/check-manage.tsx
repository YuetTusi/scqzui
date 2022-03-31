import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Split } from '@/component/style-tool';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Tag from 'antd/lib/tag';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import FetchData from '@/schema/fetch-data';
import { StateTree } from '@/type/model';
import { CheckManageTableState } from '@/model/default/check-manage-table';
import { helper } from '@/utils/helper';
import { MainBox } from '../styled/sub-layout';
import { FormBox } from './styled/style';
import { FormValue, SearchForm } from './search-form';
import { getColumns } from './column';
import CheckModal from './check-modal';
import EditModal from './edit-modal';
import { CheckManageProp } from './prop';
import { CheckJson } from '@/schema/check-json';

const cwd = process.cwd();
const { useForm } = Form;
/**
 * 点验数据管理
 */
const CheckManage: FC<CheckManageProp> = () => {

    const dispatch = useDispatch();
    const actionData = useRef<FetchData>();
    const [checkData, setCheckData] = useState<CheckJson | null>(null);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [checkModalVisible, setCheckModalVisible] = useState<boolean>(false);
    const [formRef] = useForm<FormValue>();
    const {
        loading,
        current,
        pageSize,
        total,
        data
    } = useSelector<StateTree, CheckManageTableState>(state => state.checkManageTable);

    useEffect(() => {
        query({}, 1, helper.PAGE_SIZE);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const next = await helper.readCheckJson();
                setCheckData(next);
            } catch (error) {
                console.warn(error);
            }
        })();
    }, []);

    /**
     * 查询
     * @param condition 条件
     * @param pageIndex 当前页
     * @param pageSize 页尺寸
     */
    const query = (condition: Record<string, any>, pageIndex: number, pageSize: number = helper.PAGE_SIZE) =>
        dispatch({ type: 'checkManageTable/queryData', payload: { condition, current: pageIndex, pageSize } });

    /**
     * 列action
     * @param action 操作类型
     * @param data 数据
     */
    const onAction = (action: string, data: FetchData) => {
        switch (action) {
            case 'edit':
                actionData.current = data;
                setEditModalVisible(true);
                break;
            case 'del':
                dispatch({ type: 'checkManageTable/delData', payload: data });
                break;
            default:
                console.warn('未知action', action);
                break;
        }
    };

    /**
     * 保存编辑数据
     */
    const saveHandle = (data: FetchData) => {
        dispatch({ type: 'checkManageTable/updateData', payload: data });
        setEditModalVisible(false);
    };

    /**
     * 查询handle
     */
    const onSearchHandle = () => {
        const { getFieldValue } = formRef;
        const value = getFieldValue('mobileHolder');
        query({ mobileHolder: value }, 1);
    };

    /**
     * 删除handle
     */
    const onDelHandle = () => {
        Modal.confirm({
            title: '删除',
            content: `确认删除全部点验数据？`,
            okText: '是',
            cancelText: '否',
            onOk() {
                dispatch({ type: 'checkManageTable/delData', payload: {} });
            }
        });
    };

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
    const onPageChange = (pageIndex: number) => {
        const { getFieldValue } = formRef;
        const value = getFieldValue('mobileHolder');
        query({ mobileHolder: value }, pageIndex);
    };

    /**
     * 保存Check.json
     * @param data 数据
     */
    const onSaveCheckHandle = async (data: CheckJson) => {
        message.destroy();
        try {
            await helper.writeCheckJson(data);
            setCheckData(data);
            setCheckModalVisible(false);
            message.success('配置成功');
        } catch (error) {
            message.error('配置失败');
        }
    };

    return <MainBox>
        <FormBox>
            <ul>
                <li>
                    <label>点验模式：</label>
                    {checkData?.isCheck ? <Tag color="green">已启用</Tag> : <Tag color="red">未启用</Tag>}
                </li>
                <li>
                    <Button onClick={() => setCheckModalVisible(true)} type="primary">
                        <SettingOutlined />
                        <span>配置</span>
                    </Button>
                </li>
            </ul>
            <SearchForm
                formRef={formRef}
                onDelHandle={onDelHandle}
                onSearchHandle={onSearchHandle} />
        </FormBox>
        <Split />
        <Table<FetchData>
            columns={getColumns<FetchData>(dispatch, onAction)}
            loading={loading}
            dataSource={data}
            rowKey="_id"
            pagination={
                {
                    onChange: onPageChange,
                    pageSize,
                    current,
                    total,
                    showSizeChanger: false
                }
            } />
        <CheckModal
            visible={checkModalVisible}
            data={checkData}
            saveHandle={onSaveCheckHandle}
            cancelHandle={() => setCheckModalVisible(false)} />
        <EditModal
            visible={editModalVisible}
            serial={actionData.current?.serial ?? ''}
            cancelHandle={() => setEditModalVisible(false)}
            saveHandle={saveHandle}
        />
    </MainBox>
};

export default CheckManage;