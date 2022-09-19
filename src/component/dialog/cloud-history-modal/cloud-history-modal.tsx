import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import dayjs from 'dayjs';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { ITreeNode } from '@/type/ztree';
import { AppSetStore } from '@/model/default/app-set';
import { App, AppCategory } from '@/schema/app-config';
import { CaptchaMsg, CloudAppMessages, CloudAppState } from '@/schema/cloud-app-messages';
import { SmsMessageType } from '../cloud-code-modal/prop';
import { CloudCodeModalStoreState } from '@/model/default/cloud-code-modal';
import { CloudHistoryModalBox } from './styled/style';
import { CloudHistoryModalProp } from './prop';

const { fetchText } = helper.readConf()!;
let ztree: any = null;

/**
 * 将接口JSON数据转为zTree格式
 * @param arg0 属性
 */
function toTreeData(allCloudApps: AppCategory[], cloudApps: CloudAppMessages[]) {
    let rootNode: ITreeNode = {
        name: 'App',
        iconSkin: 'app_root',
        open: true,
        children: []
    };

    for (let i = 0; i < allCloudApps.length; i++) {
        const children = findApp(allCloudApps[i].app_list, cloudApps);
        if (children.length !== 0) {
            rootNode.children?.push({
                name: allCloudApps[i].desc,
                iconSkin: `type_${allCloudApps[i].name}`,
                open: true,
                children
            });
        }
    }
    return [rootNode];
}

/**
 * 查找云取应用结果中存在的应用，如果没有返回空数组
 * @param appsInCategory 分类下的应用
 * @param CloudAppMessages Fetch推送过来的云取应用结果
 */
function findApp(appsInCategory: App[], cloudApps: CloudAppMessages[]) {
    let children: ITreeNode[] = [];
    for (let i = 0; i < appsInCategory.length; i++) {
        let has = cloudApps.find((item) => item.m_strID === appsInCategory[i].app_id);
        if (has) {
            children.push({
                name: addColor(has.state, appsInCategory[i].desc),
                iconSkin: `app_${appsInCategory[i].app_id}`,
                open: false,
                appId: appsInCategory[i].app_id
            });
        }
    }
    return children;
}

/**
 * 着色
 */
function addColor(state: CloudAppState, text: string) {
    switch (state) {
        case CloudAppState.Fetching:
            return `<span style="color:#fff;">${text}</span>`;
        case CloudAppState.Error:
            return `<span style="color:#dc143c;font-weight:bold;">${text}(失败)</span>`;
        case CloudAppState.Success:
            return `<span style="color:#23bb07;font-weight:bold;">${text}(成功)</span>`;
        default:
            return `<span style="color:#fff;">${text}</span>`;
    }
}

/**
 * 云取证采集记录框
 * @param props
 */
const CloudHistoryModal: FC<CloudHistoryModalProp> = ({
    visible,
    device,
    cancelHandle
}) => {

    const { cloudAppData } = useSelector<StateTree, AppSetStore>(state => state.appSet);
    const { devices } = useSelector<StateTree, CloudCodeModalStoreState>(state => state.cloudCodeModal);
    const [records, setRecords] = useState<CaptchaMsg[]>([]);

    /**
     * 处理树组件数据
     */
    useEffect(() => {
        const current = devices[device?.usb! - 1];
        if (current && current.apps && visible) {
            ztree = ($.fn as any).zTree.init(
                $('#cloud-history-tree'),
                {
                    callback: {
                        onClick: (event: any, treeId: string, treeNode: ITreeNode) => {
                            const { appId } = treeNode;
                            const clickApp = current.apps.find((item) => item.m_strID === appId);
                            if (clickApp && clickApp.message) {
                                setRecords(clickApp.message);
                            } else {
                                setRecords([]);
                            }
                        }
                    },
                    check: {
                        enable: false
                    },
                    view: {
                        nameIsHTML: true,
                        showIcon: true
                    }
                },
                toTreeData(cloudAppData, current.apps)
            );
        }
        return () => {
            setRecords([]);
        };
    }, [visible]);

    const renderRecords = (msg: CaptchaMsg[]) => {
        if (msg && msg.length > 0) {
            const next = msg.map((item, i) => {
                switch (item.type) {
                    case SmsMessageType.Normal:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span style={{ color: '#ffffffd9' }}>{item.content}</span>
                        </li>;
                    case SmsMessageType.Warning:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{item.content}</span>
                        </li>;
                    case SmsMessageType.Important:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span style={{ color: '#f9ca24' }}>{item.content}</span>
                        </li>;
                    default:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span>{item.content}</span>
                        </li>;
                }
            });
            return <div className="right-record">
                <ul className="history-list">{next}</ul>
            </div>;
        } else {
            return <div className="right-record empty">
                <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>;
        }
    };

    return <Modal
        footer={[
            <Button onClick={cancelHandle} type="default" key="CHM_0">
                <CheckCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        className="zero-padding-body"
        destroyOnClose={true}
        forceRender={true}
        maskClosable={false}
        width={850}
        title={`${fetchText ?? '取证'}记录`}>
        <CloudHistoryModalBox>
            <div className="cloud-panel">
                <div className="left-tree">
                    <ul className="ztree" id="cloud-history-tree"></ul>
                </div>
                {renderRecords(records)}
            </div>
        </CloudHistoryModalBox>
    </Modal>;
};

CloudHistoryModal.defaultProps = {
    visible: false,
    cancelHandle: () => { }
};

//共用CloudCodeModal组件的Model
export default CloudHistoryModal;
