import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import { StateTree } from '@/type/model';
import { getDevColumns } from './column';
import { DevListProp } from './prop';
import { ParseDevState } from '@/model/default/parse-dev';
import DeviceType from '@/schema/device-type';
import DevInfo from '../dev-info';
import { ClickType } from '../dev-info/prop';
import EditDevModal from '../edit-dev-modal';

/**
 * 设备列表
 */
const DevList: FC<DevListProp> = ({ }) => {

    const dispatch = useDispatch();
    const {
        caseId,
        data,
        loading,
        pageIndex,
        pageSize,
        total
    } = useSelector<StateTree, ParseDevState>(state => state.parseDev);
    const currentDev = useRef<DeviceType>();
    const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
    const [editDevModalVisbile, setEditDevModalVisible] = useState<boolean>(false);

    /**
     * 查询案件下设备
     * @param condition 条件
     * @param pageIndex 当前页
     */
    const query = (condition: Record<string, any>, pageIndex: number) => {
        dispatch({
            type: 'parseDev/queryDev', payload: {
                condition,
                pageIndex,
                pageSize: 5
            }
        });
    }

    useEffect(() => {
        query({}, 1);
    }, [caseId]);

    useEffect(() => {
        return () => {
            dispatch({ type: 'parseDev/setCaseId', payload: undefined });
        }
    }, []);

    /**
     * 翻页Change
     * @param pageIndex 当前页
     */
    const onPageChange = (pageIndex: number) =>
        query({}, pageIndex);

    /**
     * 展开行Change
     */
    const onExpand = (expanded: boolean, { _id }: DeviceType) => {
        if (expanded) {
            setExpandedRowKeys([_id!]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    /**
     * 
     * @param data 设备
     * @param fn 功能枚举
     */
    const onDevButtonClick = (data: DeviceType, fn: ClickType) => {
        switch (fn) {
            case ClickType.Edit:
                currentDev.current = data;
                setEditDevModalVisible(true);
                break;
            default:
                console.warn('未知Click类型:', fn);
                break;
        }
    };

    /**
     * 编辑保存
     * @param data 设备
     */
    const onEditDevSave = (data: DeviceType) => {
        dispatch({ type: 'parseDev/updateDev', payload: data });
        setEditDevModalVisible(false);
    };

    return <>
        <Table<DeviceType>
            columns={getDevColumns(dispatch)}
            dataSource={data}
            loading={loading}
            pagination={{
                onChange: onPageChange,
                current: pageIndex,
                pageSize,
                total,
                showSizeChanger: false
            }}
            locale={{
                emptyText: <Empty
                    description="暂无设备数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }}
            expandable={{
                expandedRowRender: (record) => <DevInfo
                    data={record}
                    onButtonClick={onDevButtonClick} />,
                expandedRowKeys: expandedRowKeys,
                onExpand,
                expandRowByClick: true
            }}
            rowKey="_id"
            size="small"
        />
        <EditDevModal
            onSaveHandle={onEditDevSave}
            onCancelHandle={() => setEditDevModalVisible(false)}
            visible={editDevModalVisbile}
            data={currentDev.current} />
    </>;
};

export { DevList };