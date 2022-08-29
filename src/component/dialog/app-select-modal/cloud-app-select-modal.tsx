import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import { CloudExt } from '@/schema/app-config';
import { toAppTreeData, addHoverDom, removeHoverDom } from './helper';
import { ParamDrawer } from './param-drawer';
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
    const [paramDrawerVisible, setParamDrawerVisible] = useState<boolean>(false);
    const setIds = useRef<string[]>([]); //存储设置的应用id值，用于选中树结点
    const [appId, setAppId] = useState<string>('');
    const [appDesc, setAppDesc] = useState<string>('');
    const [appExt, setAppExt] = useState<any[]>([]);

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
                        nameIsHTML: true,
                        addHoverDom,
                        removeHoverDom
                    },
                    callback: {
                        // beforeClick: () => false
                        onClick: (event: any, id: any, node: any) => {
                            console.log(node);
                        }
                    }
                },
                toAppTreeData(cloudAppData, [...new Set([...selectedKeys, ...setIds.current])], isMulti)
            );
        }
    }, [visible, appSet.cloudAppData]);

    useEffect(() => {

        if (visible) {
            $('.ext').on('click', function (event) {

                const $this = $(this);
                event.preventDefault();
                setAppId($this.attr('data-id')!);
                setAppDesc($this.attr('data-desc')!);
                setAppExt(JSON.parse($this.attr('data-ext')!));
                setParamDrawerVisible(true);

                //TODO:在此通过id找到对应的云应用，根据配置文件的ext内容生成
                //TODO:相应的输入项，将值保存到state中

                //#举例：ext:[{name:'username',title:'用户名'}]
                //#将生成一个`用记名`的文本框，用户输入的值保存到对应的云应用中
                //#云取证时，如果有附加项的值，发送给fetch
            });
        }

    }, [visible, appSet.cloudAppData]);


    const onSaveHandle = (id: string, values: Record<string, string>) => {
        const $target = $(`a[data-id="${id}"]`);
        try {
            const params = JSON.parse($target.attr('data-ext')!) as CloudExt[];
            for (let i = 0; i < params.length; i++) {
                if (values[params[i].name]) {
                    params[i].value = values[params[i].name];
                    dispatch({
                        type: 'appSet/setExtValue', payload: {
                            app_id: id,
                            name: params[i].name,
                            value: values[params[i].name]
                        }
                    });
                }
            }
            //将用户所选和设置的应用id保存，下次打开和用户已勾选进行合体
            setIds.current.push(id, ...ztree.getCheckedNodes());
            $target.attr('data-ext', JSON.stringify(params));
        } catch (error) {
            console.warn(error);
        }
        setParamDrawerVisible(false);
    };

    return <Modal
        visible={visible}
        footer={[
            <Button
                onClick={() => {
                    setIds.current = [];
                    closeHandle();
                }}
                type="default"
                key="CloudB_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => {
                    setIds.current = [];
                    okHandle(ztree.getCheckedNodes());
                }}
                type="primary"
                key="CloudB_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={() => {
            setIds.current = [];
            closeHandle();
        }}
        title={title ?? '选择App'}
        width={860}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        zIndex={1001}
        forceRender={true}
        className="zero-padding-body">
        <AppSelectModalBox>
            <div className="tip-msg">{children}</div>
            <div className="cloud-center-box">
                <div id="treePlace" className="no-data-place">
                    <Empty description="暂无云取应用" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
                <ul className="ztree" id="cloud-app-tree"></ul>
            </div>
        </AppSelectModalBox>
        <ParamDrawer
            visible={paramDrawerVisible}
            id={appId}
            name={appDesc}
            ext={appExt}
            okHandle={onSaveHandle}
            closeHandle={() => setParamDrawerVisible(false)} />
    </Modal>;
};

CloudAppSelectModal.defaultProps = {
    visible: false,
    isMulti: true,
    selectedKeys: [],
    closeHandle: () => { },
    okHandle: ([]) => { }
};

export { CloudAppSelectModal };
