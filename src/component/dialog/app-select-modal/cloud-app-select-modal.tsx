import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import { toAppTreeData, addHoverDom, removeHoverDom } from './helper';
import { AppSelectModalBox } from './styled/style';
import { CloudAppSelectModalProp } from './prop';

let ztree: any = null;

/**
 * 云取App选择弹框
 * @param props
 */
const CloudAppSelectModal: FC<CloudAppSelectModalProp> = ({
    children,
    visible,
    title,
    selectedKeys,
    isMulti,
    okHandle,
    closeHandle
}) => {

    const dispatch = useDispatch();
    const appSet = useSelector<StateTree, AppSetStore>((state) => state.appSet);

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
        if (visible) {
            const { cloudAppData } = appSet;
            if (cloudAppData.length === 0) {
                dispatch({ type: 'appSet/fetchCloudAppData' });
            }
            let $treePlace = document.getElementById('treePlace');
            if ($treePlace) {
                $treePlace.remove();
            }
            ztree = ($.fn as any).zTree.init(
                $('#cloud-app-tree'),
                {
                    check: checkOption,
                    view: {
                        showIcon: true,
                        addHoverDom,
                        removeHoverDom
                    },
                    callback: {
                        beforeClick: () => false
                    }
                },
                toAppTreeData(cloudAppData, selectedKeys, isMulti)
            );
        }
    }, [visible, appSet.cloudAppData]);

    return (
        <Modal
            visible={visible}
            footer={[
                <Button
                    onClick={closeHandle}
                    type="default"
                    key="CloudB_0">
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Button
                    onClick={() => {
                        okHandle(ztree.getCheckedNodes());
                    }}
                    type="primary"
                    key="CloudB_1">
                    <CheckCircleOutlined />
                    <span>确定</span>
                </Button>
            ]}
            onCancel={closeHandle}
            title={title ?? '选择App'}
            maskClosable={false}
            destroyOnClose={true}
            zIndex={1001}
            forceRender={true}
            style={{ top: 80 }}
            className="zero-padding-body">
            <AppSelectModalBox>
                <div className="tip-msg">{children}</div>
                <div className="center-box">
                    <div id="treePlace" className="no-data-place">
                        <Empty description="暂无云取应用" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                    <ul className="ztree" id="cloud-app-tree"></ul>
                </div>
            </AppSelectModalBox>
        </Modal>
    );
};

CloudAppSelectModal.defaultProps = {
    visible: false,
    isMulti: true,
    selectedKeys: [],
    closeHandle: () => { },
    okHandle: ([]) => { }
};

export { CloudAppSelectModal };
