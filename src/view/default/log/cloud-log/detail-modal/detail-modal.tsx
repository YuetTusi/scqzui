import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { App } from '@/schema/app-config';
import { CaptchaMsg, CloudAppMessages, CloudAppState } from '@/schema/cloud-app-messages';
import { ITreeNode } from '@/type/ztree';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import { CloudLogModalState } from '@/model/default/cloud-log-modal';
import { SmsMessageType } from '@/component/dialog/cloud-code-modal/prop';
import { DetailModalBox } from './styled/style';
import { DetailModalProps } from './prop';

const { fetchText } = helper.readConf()!;

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
            return `<span style="color:#222;">${text}</span>`;
        case CloudAppState.Error:
            return `<span style="color:#dc143c;font-weight:bold;">${text}(失败)</span>`;
        case CloudAppState.Success:
            return `<span style="color:#00ff2b;font-weight:bold;">${text}(成功)</span>`;
        default:
            return `<span style="color:#222;">${text}</span>`;
    }
}

/**
 * 云取应用详情框
 */
const CloudAppDetailModal: FC<DetailModalProps> = ({
    cancelHandle
}) => {
    // const dispatch = useDispatch();
    const { cloudAppData } = useSelector<StateTree, AppSetStore>(state => state.appSet);
    const { visible, cloudApps } = useSelector<StateTree, CloudLogModalState>(state => state.cloudLogModal);
    const [records, setRecords] = useState<CaptchaMsg[]>([]);

    /**
     * 处理树组件数据
     */
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                ($.fn as any).zTree.init(
                    $('#detail-app-tree'),
                    {
                        callback: {
                            onClick: (_: any, treeId: string, treeNode: ITreeNode) => {
                                const { appId } = treeNode;
                                const clickApp = cloudApps.find((item) => item.m_strID === appId);
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
                    toTreeData(cloudApps)
                );
            }, 0);
        }
        return () => {
            setRecords([]);
        };
    }, [visible]);

    /**
     * 将yaml中JSON数据转为zTree格式
     * @param arg0 属性
     */
    const toTreeData = useCallback(
        (cloudApps: CloudAppMessages[]) => {

            let rootNode: ITreeNode = {
                name: 'App',
                iconSkin: 'app_root',
                open: true,
                children: []
            };

            for (let i = 0, l = cloudAppData.length; i < l; i++) {
                const children = findApp(cloudAppData[i].app_list, cloudApps);
                if (children.length !== 0) {
                    rootNode.children?.push({
                        name: cloudAppData[i].desc,
                        iconSkin: `type_${cloudAppData[i].name}`,
                        open: true,
                        children
                    });
                }
            }
            return [rootNode];
        },
        [cloudAppData]
    );

    const renderRecords = (msg: CaptchaMsg[]) => {
        if (msg && msg.length > 0) {
            const next = msg.map((item, i) => {
                switch (item.type) {
                    case SmsMessageType.Normal:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span style={{ color: '#fff' }}>{item.content}</span>
                        </li>;
                    case SmsMessageType.Warning:
                        return <li key={`L_${i}`} className="history-list-item">
                            <label>
                                【{dayjs(item.actionTime).format('YYYY-MM-DD HH:mm:ss')}】
                            </label>
                            <span style={{ color: '#f5222d' }}>{item.content}</span>
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
        visible={visible}
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="CDM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        title={`${fetchText ?? '采集'}记录`}
        onCancel={cancelHandle}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        width={850}
        className="zero-padding-body">
        <DetailModalBox>
            <div className="cloud-panel">
                <div className="left-tree">
                    <ul id="detail-app-tree" className="ztree"></ul>
                </div>
                {renderRecords(records)}
            </div>
        </DetailModalBox>
    </Modal>;
};

export default CloudAppDetailModal;
