import path from 'path';
import { Dispatch } from 'redux';
import React, { MouseEvent } from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Tag from 'antd/lib/tag';
import Modal from 'antd/lib/modal';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { CaseInfo } from '@/schema/case-info';
import DeviceType from '@/schema/device-type';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { Db } from '@/utils/db';

type SetDataHandle = (data: DeviceType[]) => void;
type SetLoadingHandle = (loading: boolean) => void;
const { useAi, useBcp } = helper.readConf()!;

/**
 * 表头定义
 * @param dispatch 派发方法
 */
export function getCaseColumns(dispatch: Dispatch): ColumnsType<CaseInfo> {
    let columns: ColumnType<CaseInfo>[] = [
        {
            title: '案件名称',
            dataIndex: 'm_strCaseName',
            key: 'm_strCaseName',
            render: (cell: string) => {
                return cell.includes('_') ? cell.split('_')[0] : cell;
            }
        },
        {
            title: '备用案件名称',
            dataIndex: 'spareName',
            key: 'spareName'
        },
        {
            title: '拉取SD卡',
            dataIndex: 'sdCard',
            key: 'sdCard',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: '生成报告',
            dataIndex: 'hasReport',
            key: 'hasReport',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: '自动解析',
            dataIndex: 'm_bIsAutoParse',
            key: 'm_bIsAutoParse',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: '自动生成BCP',
            dataIndex: 'generateBcp',
            key: 'generateBcp',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: 'BCP包含附件',
            dataIndex: 'attachment',
            key: 'attachment',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: '删除原数据',
            dataIndex: 'isDel',
            key: 'isDel',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: 'AI分析',
            dataIndex: 'isAi',
            key: 'isAi',
            width: '80px',
            align: 'center',
            render: (val: boolean) =>
                val ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
        },
        {
            title: '创建时间',
            dataIndex: 'cTime',
            key: 'cTime',
            width: '160px',
            align: 'center',
            sorter: (m: DeviceType, n: DeviceType) =>
                moment(m.createdAt).isAfter(moment(n.createdAt)) ? 1 : -1,
            render: (val: any, record: DeviceType) =>
                moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '编辑',
            key: 'edit',
            width: '65px',
            align: 'center',
            render: (cell: any, record: CaseInfo) => {
                return (
                    <a
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                            e.stopPropagation();
                            dispatch(routerRedux.push(`/case-data/edit/${record._id!}`));
                        }}>
                        编辑
                    </a>
                );
            }
        },
        {
            title: '删除',
            key: 'del',
            width: '65px',
            align: 'center',
            render: (cell: any, record: CaseInfo) => {
                let pos = record.m_strCaseName.lastIndexOf('\\');
                let end = record.m_strCaseName.lastIndexOf('_');
                let caseName = record.m_strCaseName.substring(pos + 1, end);
                return (
                    <a
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                            e.stopPropagation();
                            Modal.confirm({
                                title: `删除「${caseName}」`,
                                content: `案件下取证数据将一并删除，确认吗？`,
                                okText: '是',
                                cancelText: '否',
                                onOk() {
                                    dispatch({ type: 'caseData/setLoading', payload: true });
                                    dispatch({
                                        type: 'caseData/deleteCaseData',
                                        payload: {
                                            id: record._id,
                                            casePath: path.join(
                                                record.m_strCasePath,
                                                record.m_strCaseName
                                            )
                                        }
                                    });
                                }
                            });
                        }}>
                        删除
                    </a>
                );
            }
        }
    ];

    if (!useBcp) {
        //?根据配置隐藏BCP相关列
        columns = columns.filter((item) => !(item.title as string).includes('BCP'));
    }
    if (!useAi) {
        //?根据配置隐藏AI相关列
        columns = columns.filter((item) => !(item.title as string).includes('AI'));
    }
    return columns;
}

/**
 * 表头定义
 * @param {Function} props.delHandle 删除Handle
 * @param {string} caseId 案件id
 */
export function getDeviceColumns(
    caseId: string,
    setDataHandle: SetDataHandle,
    setLoadingHandle: SetLoadingHandle
): ColumnsType<DeviceType> {
    const columns: ColumnType<DeviceType>[] = [
        {
            title: '手机名称',
            dataIndex: 'mobileName',
            key: 'mobileName',
            render(value: string, { mode }: DeviceType) {
                const [name] = value.split('_');
                // return getMobileNameByMode(name, mode!);
                return name;
            }
        },
        {
            title: '手机持有人',
            dataIndex: 'mobileHolder',
            key: 'mobileHolder',
            width: '150px'
        },
        {
            title: '手机编号',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: '150px'
        },
        {
            title: '备注',
            dataIndex: 'note',
            key: 'note',
            width: '150px',
            render(value: string) {
                return <span>{value}</span>;
            }
        },
        {
            title: '取证时间',
            dataIndex: 'fetchTime',
            key: 'fetchTime',
            width: '160px',
            align: 'center',
            sorter(m: DeviceType, n: DeviceType) {
                let isAfter = moment(m.fetchTime).isAfter(moment(n.fetchTime));
                return isAfter ? 1 : -1;
            },
            render(value: Date) {
                if (helper.isNullOrUndefined(value)) {
                    return helper.EMPTY_STRING;
                } else {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        },
        {
            title: '删除',
            key: 'del',
            width: 60,
            align: 'center',
            render: (record: DeviceType) => {
                const deviceDb = new Db<DeviceType>(TableName.Device);
                const bcpDb = new Db<DeviceType>(TableName.CreateBcpHistory);
                return (
                    <a
                        onClick={() => {
                            Modal.confirm({
                                title: `删除「${record.mobileName?.split('_')[0]}」数据`,
                                content: `确认删除该取证数据吗？`,
                                okText: '是',
                                cancelText: '否',
                                async onOk() {
                                    const modal = Modal.info({
                                        content: '正在删除，请不要关闭程序',
                                        okText: '确定',
                                        maskClosable: false,
                                        okButtonProps: {
                                            disabled: true,
                                            icon: <LoadingOutlined />
                                        }
                                    });
                                    try {
                                        setLoadingHandle(true);
                                        let success = await helper.delDiskFile(record.phonePath!);
                                        if (success) {
                                            modal.update({
                                                content: '删除成功',
                                                okButtonProps: {
                                                    disabled: false,
                                                    icon: <CheckCircleOutlined />
                                                }
                                            });
                                            //NOTE:磁盘文件删除成功后，更新数据库
                                            await Promise.all([
                                                deviceDb.remove({ _id: record._id }),
                                                bcpDb.remove({ deviceId: record.id }, true)
                                            ]);
                                            let next: DeviceType[] = await deviceDb.find({ caseId: record.caseId });
                                            setDataHandle(
                                                next.sort((m, n) =>
                                                    moment(m.fetchTime).isBefore(n.fetchTime)
                                                        ? 1
                                                        : -1
                                                )
                                            );
                                        } else {
                                            modal.update({
                                                title: '删除失败',
                                                content: '可能文件仍被占用，请稍后再试',
                                                okButtonProps: {
                                                    disabled: false,
                                                    icon: <CheckCircleOutlined />
                                                }
                                            });
                                        }
                                        setTimeout(() => {
                                            modal.destroy();
                                        }, 1000);
                                    } catch (error) {
                                        console.log(
                                            `@view/CaseData/InnerPhoneTable/columns: ${error.message}`
                                        );
                                        modal.update({
                                            title: '删除失败',
                                            content: '可能文件仍被占用，请稍后再试',
                                            okButtonProps: {
                                                disabled: false,
                                                icon: <CheckCircleOutlined />
                                            }
                                        });
                                        setTimeout(() => {
                                            modal.destroy();
                                        }, 1000);
                                    } finally {
                                        setLoadingHandle(false);
                                    }
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