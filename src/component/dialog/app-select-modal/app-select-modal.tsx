import React, { FC, useEffect } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { AppSelectModalProp } from './prop';
import { toAppTreeData, addHoverDom, removeHoverDom } from './helper';
import { AppSelectModalBox } from './styled/style';

let ztree: any = null;

/**
 * App选择弹框
 * @param props
 */
const AppSelectModal: FC<AppSelectModalProp> = ({
    treeId,
    treeData,
    selectedKeys,
    isMulti,
    title,
    children,
    visible,
    okHandle,
    closeHandle
}) => {
    /**
     * 处理树组件数据
     */
    useEffect(() => {
        let checkOption: Record<string, any> = {
            enable: true
        };
        if (!isMulti) {
            checkOption.chkStyle = 'radio';
            checkOption.radioType = 'all';
        }
        ztree = ($.fn as any).zTree.init(
            $(`#${treeId}`),
            {
                check: checkOption,
                view: {
                    showIcon: true,
                    nameIsHTML: true,
                    addHoverDom,
                    removeHoverDom
                },
                callback: {
                    beforeClick: () => false
                }
            },
            toAppTreeData(treeData, selectedKeys, isMulti)
        );
    }, [visible]);

    return (
        <Modal
            visible={visible}
            footer={[
                <Button onClick={closeHandle} type="default" key="AS_1">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Button
                    onClick={() => {
                        okHandle(ztree.getCheckedNodes());
                    }}
                    type="primary" key="AS_2">
                    <CheckCircleOutlined />
                    <span>确定</span>
                </Button>
            ]}
            onCancel={closeHandle}
            title={title ?? '选择App'}
            centered={true}
            forceRender={true}
            maskClosable={false}
            destroyOnClose={true}
            zIndex={1001}
            className="zero-padding-body">
            <AppSelectModalBox>
                <div className="tip-msg">{children}</div>
                <div className="center-box">
                    <ul className="ztree" id={treeId}></ul>
                </div>
            </AppSelectModalBox>
        </Modal>
    );
};

AppSelectModal.defaultProps = {
    visible: false,
    isMulti: true,
    treeId: 'select-app-tree',
    treeData: [],
    selectedKeys: [],
    closeHandle: () => { },
    okHandle: ([]) => { }
};

export { AppSelectModal };
