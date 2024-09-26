import { join } from 'path';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'dva';
import debounce from 'lodash/debounce';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { ITreeNode } from '@/type/ztree';
import { helper } from '@/utils/helper';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import { BatchExportReportModalState } from '@/model/default/batch-export-report-modal';
import { toTreeData, filterTree, setDefaultChecked } from './helper';
import { BatchExportReportModalBox, ControlBoxes } from './styled/style';
import { BatchExportReportModalProp, ReportExportTask } from './prop';

let ztree: any = null;

/**
 * 批量导出报告
 */
const BatchExportReportModal: FC<BatchExportReportModalProp> = ({ visible, cancelHandle }) => {
    const dispatch = useDispatch();
    const batchExportReportModal = useSelector<StateTree, BatchExportReportModalState>(state =>
        state.batchExportReportModal
    );
    const [isZip, setIsZip] = useState(false); //是压缩
    const [isAttach, setIsAttach] = useState(true); //是否带附件
    const [isEmpty, setIsEmpty] = useState(true); //是否为空

    /**
     * 验证勾选
     */
    const validCheck = (e: MouseEvent<HTMLButtonElement>) => {
        const devices: ITreeNode[] = ztree
            .getCheckedNodes()
            .filter((item: ITreeNode) => item.level === 1);
        if (devices.length === 0) {
            message.destroy();
            message.info('请选择报告');
            return;
        } else {
            selectExportDir(devices);
        }
    };

    /**
     * 选择导出目录
     */
    const selectExportDir = debounce(
        async (devices: ITreeNode[]) => {

            let exportTasks: ReportExportTask[] = [];

            const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                title: '请选择保存目录',
                properties: ['openDirectory', 'createDirectory']
            });

            if (selectVal.filePaths && selectVal.filePaths.length > 0) {
                const [saveTarget] = selectVal.filePaths; //用户所选目标目录

                message.info('开始导出报告...');
                cancelHandle();

                const prepared = devices.map((d) => {
                    const next = {
                        tId: d.tId as string,
                        deviceId: d.deviceId as string,
                        phonePath: d.phonePath as string,
                        mobileName: d.mobileName as string,
                        mobileHolder: d.mobileHolder as string,
                        mobileNo: d.mobileNo as string
                    };
                    return next;
                });

                for (let i = 0, l = prepared.length; i < l; i++) {
                    const {
                        tId, deviceId, phonePath, mobileHolder, mobileName, mobileNo
                    } = prepared[i];
                    const nodes = ztree.getNodeByTId(tId);
                    const [tree, files, attaches] = filterTree(nodes.children);
                    const [name, timestamp] = mobileName.split('_');

                    if (tree && tree.length > 0) {
                        //还原原案件名称
                        let [onlyName] = (batchExportReportModal.eventName ?? '').split('_');
                        tree[0].name = onlyName;
                    }
                    //每一个task即一个导出任务
                    exportTasks = exportTasks.concat({
                        deviceId,
                        reportRoot: join(phonePath, './report'),
                        saveTarget,
                        reportName: `${mobileHolder}-${name}${helper.isNullOrUndefinedOrEmptyString(mobileNo) ? '' : '-' + mobileNo}-${timestamp}`,
                        tree,
                        files,
                        attaches
                    } as ReportExportTask);
                }

                const msg = new AlartMessageInfo({
                    id: helper.newId(),
                    msg: `正在批量导出报告`
                });
                dispatch({
                    type: 'alartMessage/addAlertMessage',
                    payload: msg
                });
                dispatch({
                    type: 'operateDoing/setExportingDeviceId',
                    payload: exportTasks.map((i) => i.deviceId)
                });
                ipcRenderer.send('report-batch-export', exportTasks, isAttach, isZip, msg.id);
                ipcRenderer.send('show-progress', true);
            }
        },
        500,
        { trailing: false, leading: true }
    );

    useEffect(() => {
        if (visible) {
            (async () => {
                const treeNodes = await toTreeData(
                    batchExportReportModal.eventName,
                    batchExportReportModal.records
                );
                if (treeNodes.children && treeNodes.children.length === 0) {
                    setIsEmpty(true);
                } else {
                    ztree = ($.fn as any).zTree.init(
                        $('#batchReportTree'),
                        {
                            check: {
                                enable: true
                            },
                            view: {
                                nameIsHTML: true,
                                showIcon: false
                            }
                        },
                        treeNodes
                    );
                    ztree.checkAllNodes(true);
                    setDefaultChecked(ztree);
                    setIsEmpty(false);
                }
            })();
        }
    }, [visible, batchExportReportModal]);

    return <Modal
        footer={[
            <ControlBoxes key="BER_0">
                <Checkbox
                    checked={isZip}
                    disabled={isEmpty}
                    onChange={() => setIsZip((prev) => !prev)}
                />
                <span
                    onClick={() => {
                        if (!isEmpty) {
                            setIsZip((prev) => !prev);
                        }
                    }}>
                    压缩
                </span>
                <Checkbox
                    checked={isAttach}
                    disabled={isEmpty}
                    onChange={() => setIsAttach((prev) => !prev)}
                />
                <span
                    onClick={() => {
                        if (!isEmpty) {
                            setIsAttach((prev) => !prev);
                        }
                    }}>
                    附件
                </span>
                {/* <Auth deny={!useFakeButton}>
                    <Button disabled={isEmpty} onClick={validCheck} type="primary">
                        <FilePdfOutlined />
                        <span>导出PDF</span>
                    </Button>
                </Auth> */}
                <Button disabled={isEmpty} onClick={validCheck} type="primary">
                    <ExportOutlined />
                    <span>导出报告</span>
                </Button>
            </ControlBoxes>
        ]}
        onCancel={() => {
            setIsAttach(true);
            setIsZip(false);
            cancelHandle();
        }}
        visible={visible}
        title="导出报告"
        width={650}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        className="zero-padding-body">
        <BatchExportReportModalBox>
            <fieldset className="batch-export-tips">
                <legend>批量导出提示</legend>
                <div>
                    <ul>
                        <li>
                            无报告数据请先进行<em>生成报告</em>操作
                        </li>
                        <li>
                            导出目录若存在<em>相同文件会覆盖</em>，导出前请确认
                        </li>
                        <li>
                            请保证磁盘空间充足；数据过大会较慢，导出过程中<em>请勿关闭应用</em>
                        </li>
                    </ul>
                </div>
            </fieldset>
            <div className="export-panel">
                <ul
                    style={{ display: isEmpty ? 'none' : 'block' }}
                    id="batchReportTree"
                    className="ztree"></ul>
                <div style={{ display: isEmpty ? 'flex' : 'none' }} className="empty-report">
                    <Empty description="暂无报告" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            </div>
        </BatchExportReportModalBox>
    </Modal>;
};

BatchExportReportModal.defaultProps = {
    visible: false,
    cancelHandle: () => { }
};

export default BatchExportReportModal;