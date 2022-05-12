import debounce from 'lodash/debounce';
import React, { FC, useEffect, useRef, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'dva';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input, { InputRef } from 'antd/lib/input';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { SelfUnitState } from '@/model/default/self-unit';
import { helper } from '@/utils/helper';
import { Split } from '@/component/style-tool';
import { Organization } from '@/schema/organization';
import { SelfUnit as SelfUnitEntity } from '@/schema/self-unit';
import { BarBox } from './styled/style';
import { MainBox } from '../styled/sub-layout';
import EditUnitModal from './edit-unit-modal';
import { getColumns } from './column';
import { SelfUnitProp } from './prop';

/**
 * 自定义单位管理
 */
const SelfUnit: FC<SelfUnitProp> = () => {

    const dispatch = useDispatch();
    const {
        pageIndex, pageSize, total, loading, data
    } = useSelector<StateTree, SelfUnitState>(state => state.selfUnit);
    const {
        collectUnitCode,
        collectUnitName
    } = useSelector<StateTree, Organization>(state => state.organization);
    const [editUnitModalVisible, setEditUnitModalVisible] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [editData, setEditData] = useState<SelfUnitEntity>();
    const selectedUnitName = useRef<string | undefined>(collectUnitName);
    const inputRef = useRef<InputRef | null>(null);

    useEffect(() => {
        query({}, 1);
    }, []);

    /**
     * 查询
     * @param pageIndex 当页页
     * @param pageSize 页尺寸
     */
    const query = (condition: Record<string, any>, pageIndex: number, pageSize: number = helper.PAGE_SIZE) =>
        dispatch({ type: 'selfUnit/query', payload: { condition, pageIndex, pageSize } });

    /**
     * 查询click
     */
    const onSearchClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        let condition: any = {};
        if (inputRef.current !== null && !helper.isNullOrUndefinedOrEmptyString(inputRef.current.input?.value)) {
            condition.unitName = inputRef.current.input!.value;
        }
        query(condition, 1);
    };

    /**
     * 翻页Change
     * @param pageIndex 当页页
     * @param pageSize 页尺寸
     */
    const onPageChange = (pageIndex: number, pageSize: number = helper.PAGE_SIZE) => {
        let condition: any = {};
        if (inputRef.current !== null && !helper.isNullOrUndefinedOrEmptyString(inputRef.current.input?.value)) {
            condition.unitName = inputRef.current.input!.value;
        }
        query(condition, pageIndex, pageSize);
    };

    /**
     * 行选中Change
     */
    const onSelectedRowChange = (keys: Key[]) => {
        setSelectedRowKeys(keys);
    };

    /**
     * 保存handle
     * @param entity 数据
     */
    const onSaveHandle = (entity: SelfUnitEntity) => {
        if (editData) {
            //编辑
            dispatch({ type: 'selfUnit/update', payload: entity });
        } else {
            //添加
            const next: SelfUnitEntity = { ...entity, _id: helper.newId() };
            dispatch({ type: 'selfUnit/save', payload: next });
        }
        setEditData(undefined);
        setEditUnitModalVisible(false);
    };

    /**
     * 保存单位Click
     */
    const onSelectUnitClick = debounce((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (selectedRowKeys.length !== 0) {
            console.log(selectedRowKeys[0], selectedUnitName.current);
            dispatch({
                type: 'organization/saveSelfUnit',
                payload: {
                    unitCode: selectedRowKeys[0],
                    unitName: selectedUnitName.current
                }
            });
        } else {
            message.destroy();
            message.info('请选择采集单位');
        }
    }, 500, { leading: true, trailing: false })

    /**
     * 显示编辑弹框handle
     */
    const editVisbileHandle = (data: SelfUnitEntity) => {
        setEditData(data);
        setEditUnitModalVisible(true);
    };

    /**
     * 取消handle
     * @param data 数据
     */
    const onCancelHandle = () => {
        setEditData(undefined);
        setEditUnitModalVisible(false);
    };

    return <MainBox>
        <BarBox>
            <div className="u-name" title={collectUnitCode ?? '未设置单位'}>{collectUnitName ?? '未设置单位'}</div>
            <div className="u-btn">
                <Input ref={inputRef} placeholder="请输入单位名称查询" />
                <Button onClick={onSearchClick} type="primary">
                    <SearchOutlined />
                    <span>查询</span>
                </Button>
                <Button onClick={() => setEditUnitModalVisible(true)} type="primary">
                    <PlusCircleOutlined />
                    <span>添加</span>
                </Button>
                <Button onClick={onSelectUnitClick} type="primary">
                    <CheckCircleOutlined />
                    <span>保存</span>
                </Button>
            </div>
        </BarBox>
        <Split />
        <Table<SelfUnitEntity>
            pagination={{
                onChange: onPageChange,
                current: pageIndex,
                pageSize,
                total
            }}
            rowSelection={{
                onChange: onSelectedRowChange,
                selectedRowKeys,
                type: 'radio'
            }}
            onRow={({ _id, unitName }) => ({
                onClick: () => {
                    setSelectedRowKeys([_id!]);
                    selectedUnitName.current = unitName;
                }
            })}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            columns={getColumns(dispatch, editVisbileHandle)} />
        <EditUnitModal
            visible={editUnitModalVisible}
            data={editData}
            saveHandle={onSaveHandle}
            cancelHandle={onCancelHandle} />
    </MainBox>;
}

export default SelfUnit;