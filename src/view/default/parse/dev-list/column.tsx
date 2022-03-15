import { join } from 'path';
import { mkdirSync } from 'fs';
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
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import DeviceType from "@/schema/device-type";
import { ParseState } from "@/schema/device-state";
import DeviceSystem from '@/schema/device-system';
import { DataMode } from '@/schema/data-mode';
import { LocalStoreKey } from '@/utils/local-store';
import { TableName } from '@/schema/table-name';
import CaseInfo from '@/schema/case-info';
import CommandType, { SocketType } from '@/schema/command';
import { Db } from '@/utils/db';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';


const { Group } = Button;

/**
 * 解析是否为禁用状态
 */
const isParseDisable = (state: ParseState) => {
    if (state === ParseState.Parsing || state === ParseState.Fetching || state === ParseState.Exception) {
        return true;
    } else {
        return false;
    }
};

/**
 * 执行解析
 * @param dispatch Dispatch
 * @param data 设备数据
 */
const doParse = async (dispatch: Dispatch, data: DeviceType) => {

    const db = new Db<CaseInfo>(TableName.Case);
    let useKeyword = localStorage.getItem(LocalStoreKey.UseKeyword) === '1';
    let useDocVerify = localStorage.getItem(LocalStoreKey.UseDocVerify) === '1';
    let caseData: CaseInfo = await db.findOne({
        _id: data.caseId
    });
    let caseJsonPath = join(data.phonePath!, '../../');
    let caseJsonExist = await helper.existFile(join(caseJsonPath, 'Case.json'));

    if (!caseJsonExist) {
        await helper.writeCaseJson(caseJsonPath, caseData);
    }

    send(SocketType.Parse, {
        type: SocketType.Parse,
        cmd: CommandType.StartParse,
        msg: {
            caseId: data.caseId,
            deviceId: data._id,
            phonePath: data.phonePath,
            hasReport: caseData?.hasReport ?? false,
            isDel: caseData?.isDel ?? false,
            isAi: caseData?.isAi ?? false,
            aiTypes: [
                caseData.aiThumbnail ? 1 : 0,
                caseData.aiDoc ? 1 : 0,
                caseData.aiDrug ? 1 : 0,
                caseData.aiMoney ? 1 : 0,
                caseData.aiNude ? 1 : 0,
                caseData.aiWeapon ? 1 : 0,
                caseData.aiDress ? 1 : 0,
                caseData.aiTransport ? 1 : 0,
                caseData.aiCredential ? 1 : 0,
                caseData.aiTransfer ? 1 : 0,
                caseData.aiScreenshot ? 1 : 0
            ],
            useKeyword,
            useDocVerify,
            dataMode: data.mode ?? DataMode.Self,
            tokenAppList: caseData.tokenAppList
                ? caseData.tokenAppList.map((i) => i.m_strID)
                : []
        }
    });
    dispatch({
        type: 'parseDev/updateParseState',
        payload: {
            id: data._id,
            parseState: ParseState.Parsing,
            pageIndex: 1
        }
    });
};

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
            render: (id: string, record) => {

                return <Group size="small">
                    <Button
                        type="primary"
                        size="small"
                        disabled={isParseDisable(record.parseState!)}
                        onClick={async (event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            let exist = await helper.existFile(record.phonePath!);
                            if (exist) {
                                if (record.parseState === ParseState.NotParse) {
                                    doParse(dispatch, record);
                                } else {
                                    Modal.confirm({
                                        title: '重新解析',
                                        content: '可能所需时间较长，确定重新解析吗？',
                                        okText: '是',
                                        cancelText: '否',
                                        onOk() {
                                            doParse(dispatch, record);
                                        }
                                    });
                                }
                            } else {
                                message.destroy();
                                message.warning('取证数据不存在');
                            }
                        }}>
                        解析
                    </Button>
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