import { join } from 'path';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import debounce from 'lodash/debounce';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { ITreeNode } from '@/type/ztree';
import DeviceType from '@/schema/device-type';
import { CaseInfo } from '@/schema/case-info';
import { TableName } from '@/schema/table-name';
import { StateTree } from '@/type/model';
import { ExportBcpModalState } from '@/model/default/export-bcp-modal';
import { ExportBcpModalBox } from './styled/style';
import { ExportBcpModalProp } from './prop';
import { getDb } from '@/utils/db';

let ztree: any = null;

/**
 * 查询案件下的设备
 * @param caseId 案件id
 */
const queryDevice = async (caseId: string) => {
    const db = getDb<DeviceType>(TableName.Devices);
    let devices: DeviceType[] = [];
    try {
        devices = await db.find({ caseId });
    } catch (error) {
        log.error(`查询设备失败 @view/Parse/ExportBcpModal/queryDevice: ${error.message}`);
    }
    return devices;
};

/**
 * 返回zTree数据
 * @param isBatch 是否是批量
 * @param caseData 案件数据
 * @param devices 设备数据
 */
const toTreeData = async (isBatch: boolean, caseData: CaseInfo, device: DeviceType) => {
    if (isBatch) {
        //批量
        const devicesInCase = await queryDevice(caseData._id!); //查询案件下的设备
        let deviceNodes = await mapDeviceToTree(devicesInCase);
        let rootNode: ITreeNode = {
            name: caseData.m_strCaseName.split('_')[0],
            children: deviceNodes
        };
        return rootNode;
    } else {
        //非批量
        let bcpNodes = await readBcpFiles(device.phonePath!);
        let [onlyName] = device.mobileName!.split('_');
        let rootNode: ITreeNode = {
            name: `${onlyName}（${device.mobileHolder}）`,
            children: bcpNodes
        };
        return rootNode;
    }
};

/**
 * 返回设备下的BCP文件node
 * @param devices 设备
 */
const mapDeviceToTree = async (devices: DeviceType[]) => {
    let nodes: ITreeNode[] = [];
    for (let i = 0; i < devices.length; i++) {
        const { phonePath, mobileName, mobileHolder } = devices[i];
        const [onlyName] = mobileName!.split('_');
        const bcpFiles = await readBcpFiles(phonePath!);
        if (bcpFiles !== undefined) {
            nodes = nodes.concat([
                {
                    name: `${onlyName}（${mobileHolder}）`,
                    children: bcpFiles
                }
            ]);
        }
    }
    return nodes;
};

/**
 * 读取手机目录下的BCP文件
 * @param phonePath 设备（手机）路径
 */
const readBcpFiles = async (phonePath: string): Promise<ITreeNode[] | undefined> => {
    const bcpPath = join(phonePath, 'BCP'); //BCP目录
    const exist = await helper.existFile(bcpPath);
    if (exist) {
        const files = await helper.readDir(bcpPath);
        if (files.length === 0) {
            return undefined;
        } else {
            return files.map((i) => ({ name: i, value: join(bcpPath, i) }));
        }
    } else {
        return undefined;
    }
};

/**
 * 批量导出BCP框
 * @param props
 */
const ExportBcpModal: FC<ExportBcpModalProp> = ({ visible, okHandle, cancelHandle }) => {

    const {
        exporting,
        isBatch,
        exportBcpCase,
        exportBcpDevice
    } = useSelector<StateTree, ExportBcpModalState>(state => state.exportBcpModal);

    const [isEmpty, setIsEmpty] = useState<boolean>(false); //BCP文件是否为空

    useEffect(() => {
        (async () => {
            if (visible) {
                const treeNodes = await toTreeData(isBatch, exportBcpCase, exportBcpDevice);
                console.log(treeNodes);
                setIsEmpty(treeNodes.children === undefined || treeNodes.children!.length === 0);

                ztree = ($.fn as any).zTree.init(
                    $('#bcp-tree'),
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
                ztree.expandAll(true);
            }
        })();
    }, [visible]);

    /**
     * 导出事件handle
     */
    const exportHandle = debounce(
        async (event: MouseEvent<HTMLButtonElement>) => {
            const bcpNodeLevel = isBatch ? 2 : 1;
            const bcpPathList = ztree
                .getCheckedNodes()
                .filter((node: ITreeNode) => node.level === bcpNodeLevel)
                .map((i: ITreeNode) => i.value);
            if (bcpPathList.length !== 0) {
                const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                    title: '请选择保存目录',
                    properties: ['openDirectory', 'createDirectory']
                });
                if (selectVal.filePaths && selectVal.filePaths.length > 0) {
                    okHandle(bcpPathList, selectVal.filePaths[0]);
                }
            } else {
                message.destroy();
                message.info('请选择BCP文件');
            }
        },
        400,
        { leading: true, trailing: false }
    );

    const onCancelClick = (event: MouseEvent<HTMLElement>) => cancelHandle();

    return (
        <Modal
            footer={[
                <Button onClick={cancelHandle} key="EBCP_0">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Button
                    disabled={exporting}
                    onClick={exportHandle}
                    type="primary"
                    key="EBCP_1">
                    {exporting ? <LoadingOutlined /> : <CheckCircleOutlined />}
                    <span>导出</span>
                </Button>
            ]}
            onCancel={onCancelClick}
            visible={visible}
            title="导出BCP"
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            className="zero-padding-body">
            <ExportBcpModalBox>
                <div className="export-panel">
                    <ul
                        id="bcp-tree"
                        className="ztree"
                        style={{ display: isEmpty ? 'none' : 'block' }}></ul>
                    <div className="empty-bcp" style={{ display: isEmpty ? 'flex' : 'none' }}>
                        <Empty description="暂无BCP文件" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                </div>
            </ExportBcpModalBox>
        </Modal>
    );
};

ExportBcpModal.defaultProps = {
    visible: false,
    okHandle: () => { },
    cancelHandle: () => { }
};

export default ExportBcpModal;
