import chunk from 'lodash/chunk';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileWaveform } from '@fortawesome/free-solid-svg-icons';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import FetchData from '@/schema/fetch-data';
import { CloudApp } from '@/schema/cloud-app';
import { CloudState } from '@/model/default/cloud';
import AppEvi from './app-evi';
import FetchInfo from './fetch-info';
import { EmptyBox } from './styled/box';
import CloudAppModal from './cloud-app-modal';
import { ContentBox, ItemPanel } from './styled/box';
import { CloudProp } from './prop';

const { Group } = Button;
const { fetchText, parseText } = helper.readConf()!;

/**
 * 云取证
 */
const Cloud: FC<CloudProp> = () => {

    const dispatch = useDispatch();
    const { data } = useSelector<StateTree, CloudState>(state => state.cloud);
    const [cloudAppModalVisible, setCloudAppModalVisible] = useState(false);

    const onCloudAppModalSave = (data: FetchData) => {
        dispatch({ type: 'cloud/setData', payload: data });
        setCloudAppModalVisible(false);
    };

    /**
     * 删除应用
     * @param app 待删除的云应用 
     */
    const onAppDelete = (app: CloudApp) => {
        Modal.confirm({
            onOk() {
                if (data !== null) {
                    dispatch({ type: 'cloud/removeCloudApp', payload: app.m_strID });
                }
            },
            centered: true,
            okText: '是',
            cancelText: '否',
            title: '删除',
            content: `确认删除「${app.name}」？`
        });
    };

    const renderCloudApps = () => {
        if (helper.isNullOrUndefined(data) || data!.cloudAppList?.length === 0) {
            return <EmptyBox>
                <Empty
                    description="暂无云取应用，请添加"
                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>;
        } else {
            return chunk(data!.cloudAppList?.map((item) => <Col
                key={`C_${item.key}`}
                span={6}>
                <AppEvi
                    app={item}
                    onDelete={onAppDelete} />
            </Col>), 4)
                .map((cols, index) => <Row
                    key={`R_${index}`}>
                    {...cols}
                </Row>);

            // return data!.cloudAppList?.map((item) => <AppEvi
            //     app={item}
            //     onDelete={onAppDelete}
            //     key={`C_${item.key}`} />);
        }
    };

    return <SubLayout title={`云${fetchText ?? '取证'}`}>
        <ContentBox>
            <div className="button-bar">
                <Group>
                    <Button onClick={() => setCloudAppModalVisible(true)} type="primary">
                        <PlusCircleOutlined />
                        <span>添加云取应用</span>
                    </Button>
                    <Button onClick={() => {
                        Modal.confirm({
                            onOk() {
                                dispatch({ type: 'cloud/setData', payload: null });
                            },
                            centered: true,
                            okText: '是',
                            cancelText: '否',
                            title: '清除',
                            content: '确认清除所有云取应用？'
                        });
                    }} type="primary">
                        <ClearOutlined />
                        <span>清除</span>
                    </Button>
                </Group>
                {/* <Button onClick={() => dispatch(routerRedux.push('/parse'))} type="primary">
                    <FontAwesomeIcon
                        icon={faFileWaveform}
                        style={{ marginRight: '10px' }} />
                    <span>{`数据${parseText ?? '解析'}`}</span>
                </Button> */}
            </div>
            <Split />
            <FetchInfo data={data} />
            <ItemPanel>
                {renderCloudApps()}
            </ItemPanel>
        </ContentBox>
        <CloudAppModal
            onSave={onCloudAppModalSave}
            onCancel={() => setCloudAppModalVisible(false)}
            visible={cloudAppModalVisible} />
    </SubLayout>
};

export { Cloud };