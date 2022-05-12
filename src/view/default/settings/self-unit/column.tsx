import React from 'react';
import { Dispatch } from 'dva';
import Modal from 'antd/lib/modal';
import { ColumnsType } from 'antd/lib/table';
import { SelfUnit as SelfUnitEntity } from '@/schema/self-unit';

/**
 * 表头定义
 */
export function getColumns(dispatch: Dispatch, ...handles: any[]): ColumnsType<SelfUnitEntity> {

    const [editHandle] = handles;

    let columns: ColumnsType<SelfUnitEntity> = [
        {
            title: '单位名称',
            dataIndex: 'unitName',
            key: 'unitName',
            render(val: string) {
                if (val) {
                    return <span>{val}</span>;
                } else {
                    return null;
                }
            }
        },
        {
            title: '编辑',
            dataIndex: '_id',
            key: 'del',
            width: 60,
            align: 'center',
            render(id: string, record) {
                return (
                    <a
                        onClick={() => {
                            editHandle(record);
                        }}>
                        编辑
                    </a>
                );
            }
        },
        {
            title: '删除',
            dataIndex: '_id',
            key: 'del',
            width: 60,
            align: 'center',
            render(id: string, record: SelfUnitEntity) {
                return (
                    <a
                        onClick={async () => {
                            Modal.confirm({
                                title: '删除单位',
                                content: `确认删除「${record.unitName}」？`,
                                okText: '是',
                                cancelText: '否',
                                onOk() {
                                    dispatch({ type: 'selfUnit/del', payload: id });
                                }
                            });
                        }}>
                        删除
                    </a>
                );
            }
        }
    ];
    return columns;
}
