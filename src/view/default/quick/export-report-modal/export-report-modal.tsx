import path from 'path';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, memo, useEffect, useRef, useState, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import debounce from 'lodash/debounce';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import log from '@/utils/log';
import { AlartMessageInfo } from '@/component/alert-message/prop';
import { expandNodes, filterTree, mapTree, readTxtFile } from './tree-util';
import { ExportReportModalProp } from './prop';
import { ExportReportModalBox, ControlBoxes } from './styled/style';

let ztree: any = null;

/**
 * 导出报告框
 */
const ExportReportModal: FC<ExportReportModalProp> = ({ visible, data, closeHandle }) => {
    const dispatch = useDispatch();
    const [isAttach, setIsAttach] = useState<boolean>(true); //带附件
    const [isZip, setIsZip] = useState<boolean>(false); //压缩
    const nameInputRef = useRef<any>(null); //重命名Input引用

    /**
     * 处理树组件数据
     */
    useEffect(() => {
        if (visible) {
            const treeJsonPath = path.join(
                data?.phonePath!,
                'report/public/data/tree.json'
            );
            (async () => {
                try {
                    let fakeJson = await readTxtFile(treeJsonPath);
                    let startPos = fakeJson.indexOf('=') + 1;
                    let zTreeData = JSON.parse(fakeJson.substring(startPos));

                    ztree = ($.fn as any).zTree.init(
                        $('#export-report-tree'),
                        {
                            check: {
                                enable: true
                            },
                            view: {
                                nameIsHTML: true,
                                showIcon: false
                            }
                        },
                        mapTree(zTreeData)
                    );
                    expandNodes(ztree, ztree.getNodes(), 3);
                } catch (error) {
                    message.error('加载报告数据失败');
                    console.log(`加载报告数据失败:${error.message}`);
                    log.error(
                        `读取报告tree.json数据失败 @view/record/Parse/ExportReportModal: ${error.message}`
                    );
                }
            })();
        }
    }, [visible]);

    /**
     * 选择导出目录
     */
    const selectExportDir = async () => {
        const { value } = nameInputRef.current!.input;
        const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
            title: '请选择保存目录',
            properties: ['openDirectory', 'createDirectory']
        });
        const { mobileHolder, mobileName, mobileNo, _id } = data!;

        let reportName = `${mobileHolder}-${mobileName?.split('_')[0]
            }${helper.isNullOrUndefinedOrEmptyString(mobileNo) ? '' : '-' + mobileNo}-${helper.timestamp()}`;
        if (value.trim() !== '') {
            //若输入了报告名称，则使用输入内容
            reportName = value;
        }
        if (selectVal.filePaths && selectVal.filePaths.length > 0) {
            const [saveTarget] = selectVal.filePaths; //用户所选目标目录
            const reportRoot = path.join(data?.phonePath!, 'report'); //当前报告目录

            message.info('开始导出报告...');
            const msg = new AlartMessageInfo({
                id: helper.newId(),
                msg: `正在导出「${reportName}」`
            });
            dispatch({
                type: 'alartMessage/addAlertMessage',
                payload: msg
            });
            dispatch({ type: 'operateDoing/setExportingDeviceId', payload: [_id] });
            closeHandle!();
            let [tree, files, attaches] = filterTree(ztree.getNodes());
            ipcRenderer.send(
                'report-export',
                {
                    reportRoot,
                    saveTarget,
                    reportName,
                    isZip,
                    isAttach
                },
                {
                    tree,
                    files,
                    attaches
                },
                msg.id
            );
            ipcRenderer.send('show-progress', true);
        }
    };

    /**
     * 导出报告handle
     */
    const exportHandle = debounce(
        (e: MouseEvent<HTMLButtonElement>) => {
            let [, files] = filterTree(ztree.getNodes());
            if (files.length === 0) {
                message.destroy();
                message.info('请选择报告数据');
            } else {
                selectExportDir();
            }
        },
        500,
        { leading: true, trailing: false }
    );

    const onCancel = () => {
        setIsAttach(true);
        setIsZip(false);
        closeHandle!();
    };

    return <Modal
        open={visible}
        footer={[
            <ControlBoxes key="ER_0">
                <label htmlFor="reportName">重命名：</label>
                <Input
                    ref={nameInputRef}
                    placeholder="请输入导出报告文件名"
                    name="reportName"
                    size="small"
                    maxLength={100}
                />
                <div className="control-checkbox">
                    <Checkbox checked={isZip} onChange={() => setIsZip((prev) => !prev)} />
                    <span onClick={() => setIsZip((prev) => !prev)}>压缩</span>
                </div>
                <div className="control-checkbox">
                    <Checkbox checked={isAttach} onChange={() => setIsAttach((prev) => !prev)} />
                    <span onClick={() => setIsAttach((prev) => !prev)}>附件</span>
                </div>
                {/* <Auth deny={!useFakeButton}>
                    <Button type="primary" onClick={exportHandle}>
                        <FilePdfOutlined />
                        <span>导出PDF</span>
                    </Button>
                </Auth> */}
                <Button type="primary" onClick={exportHandle}>
                    <ExportOutlined />
                    <span>导出报告</span>
                </Button>
            </ControlBoxes>
        ]}
        onCancel={onCancel}
        title="导出报告"
        width={650}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        className="zero-padding-body">
        <ExportReportModalBox>
            <div className="export-panel">
                <div className="top-bar"></div>
                <div className="center-box">
                    <ul id="export-report-tree" className="ztree"></ul>
                </div>
            </div>
        </ExportReportModalBox>
    </Modal>;
};

ExportReportModal.defaultProps = {
    visible: false,
    closeHandle: () => { }
};

export default memo(ExportReportModal);
