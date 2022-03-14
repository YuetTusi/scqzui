import dayjs from 'dayjs';
import classnames from 'classnames';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import CloudOutlined from '@ant-design/icons/CloudOutlined';
import React, { MouseEvent } from 'react';
import { Dispatch } from "dva";
import { ColumnsType, ColumnType } from "antd/lib/table";
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import DeviceType from "@/schema/device-type";
import { ParseState } from "@/schema/device-state";
import DeviceSystem from '@/schema/device-system';
import { DataMode } from '@/schema/data-mode';

const { Group } = Button;

/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getDevColumns(dispatch: Dispatch): ColumnsType<DeviceType> {
    let columns: ColumnType<DeviceType>[] = [
        {
            title: '状态',
            dataIndex: 'parseState',
            key: 'parseState',
            width: '75px',
            align: 'center',
            render(state: ParseState) {
                switch (state) {
                    case ParseState.Fetching:
                        return <Tag style={{ marginRight: 0 }}>采集中</Tag>;
                    case ParseState.NotParse:
                        return <Tag style={{ marginRight: 0 }}>未解析</Tag>;
                    case ParseState.Parsing:
                        return <Tag color="blue" style={{ marginRight: 0 }}>解析中</Tag>;
                    case ParseState.Finished:
                        return <Tag color="green" style={{ marginRight: 0 }}>完成</Tag>;
                    case ParseState.Error:
                        return <Tag color="red" style={{ marginRight: 0 }}>失败</Tag>;
                    case ParseState.Exception:
                        return <Tag color="red" style={{ marginRight: 0 }}>异常</Tag>;
                    default:
                        return <Tag>未解析</Tag>;
                }
            }
        },
        {
            title: '手机',
            dataIndex: 'mobileName',
            key: 'mobileName',
            render: (value: string, { system, mode }: DeviceType) => {
                return <div>
                    <span>
                        {
                            system === DeviceSystem.IOS
                                ? <AppleFilled title="苹果设备" />
                                : <AndroidFilled style={{ color: '#76c058' }} title="安卓设备" />
                        }
                        {
                            mode === DataMode.ServerCloud
                                ? <CloudOutlined style={{ marginLeft: '5px' }} title="云取证" className="cloud-color" />
                                : null
                        }
                    </span>
                    <span
                        className={classnames({ 'cloud-color': mode === DataMode.ServerCloud })}
                        style={{ marginLeft: '5px' }}>
                        {value.split('_')[0]}
                    </span>
                </div>;
            }
        },
        {
            title: '持有人',
            dataIndex: 'mobileHolder',
            key: 'mobileHolder'
        },
        {
            title: '取证时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: '160px',
            render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '···',
            dataIndex: '_id',
            key: '_id',
            align: 'center',
            width: '50px',
            render: () => {
                return <Group size="small">
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                        }}
                        type="primary">解析</Button>
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                        }}
                        type="primary">查看报告</Button>
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                        }}
                        type="primary">生成报告</Button>
                    <Button
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                        }}
                        type="primary">导出报告</Button>
                </Group>
            }
        }
    ];

    return columns;
}