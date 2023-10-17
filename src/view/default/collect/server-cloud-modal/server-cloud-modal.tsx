import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, { FC, MouseEvent, useEffect, useState, useRef } from 'react';
import round from 'lodash/round';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined';
import SelectOutlined from '@ant-design/icons/SelectOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Collapse from 'antd/lib/collapse';
import Button from 'antd/lib/button';
import AutoComplete from 'antd/lib/auto-complete';
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';
import { ITreeNode } from '@/type/ztree';
import { useSubscribe } from '@/hook';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { LocalStoreKey } from '@/utils/local-store';
import { Backslashe, UnderLine, MobileNumber } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { CloudAppSelectModal } from '@/component/dialog/app-select-modal';
import { CaseInfo } from '@/schema/case-info';
import FetchData from '@/schema/fetch-data';
import { DataMode } from '@/schema/data-mode';
import { CloudApp } from '@/schema/cloud-app';
import { StateTree } from '@/type/model';
import { CaseDataState } from '@/model/default/case-data';
import { Instruction } from '../instruction';
import PanelHeader from './panel-hader';
import { ServerCloudModalBox } from './styled/style';
import { FormValue, Prop } from './prop';

const { Panel } = Collapse;
const { Item, useForm } = Form;
const { cloudAppUrl, caseText, devText, fetchText } = helper.readConf()!;

/**
 * 过滤勾选的node，返回level==2的应用结点
 * @param treeNode 勾选的zTree结点
 */
function filterToParseApp(treeNodes: ITreeNode[]) {
    return treeNodes
        .filter((node) => node.level == 2)
        .map((node) =>
            new CloudApp({
                m_strID: node.id,
                key: node.appKey,
                name: node.appDesc,
                ext: node.ext
            }));
}

/**
 * 保存云取相关时间数据到localStorage
 * @param cloudTimeout 云取超时时间
 * @param cloudTimespan 云取时间间隔
 * @param isAlive 是否保活
 */
function saveTimeToStorage(cloudTimeout: number, cloudTimespan: number, isAlive: boolean = false) {
    if (cloudTimeout != helper.CLOUD_TIMEOUT) {
        localStorage.setItem(LocalStoreKey.CloudTimeout, cloudTimeout.toString());
    }
    if (cloudTimespan != helper.CLOUD_TIMESPAN) {
        localStorage.setItem(LocalStoreKey.CloudTimespan, cloudTimespan.toString());
    }
    localStorage.setItem(LocalStoreKey.IsAlive, isAlive ? '1' : '0');
}

/**
 * 从localStorage中取云取时间值
 * @param key 键
 */
function getTimeFromStorage(key: LocalStoreKey) {
    switch (key) {
        case LocalStoreKey.CloudTimeout:
            let timeout = localStorage.getItem(LocalStoreKey.CloudTimeout);
            return timeout === null ? helper.CLOUD_TIMEOUT : Number.parseInt(timeout);
        case LocalStoreKey.CloudTimespan:
            let timespan = localStorage.getItem(LocalStoreKey.CloudTimespan);
            return timespan === null ? helper.CLOUD_TIMESPAN : Number.parseInt(timespan);
        default:
            return 0;
    }
}

function getIsAliveFromStorage() {
    return localStorage.getItem(LocalStoreKey.IsAlive) === '1';
}

/**
 * 采集录入框（短信云取证）
 */
const ServerCloudModal: FC<Prop> = ({
    visible,
    device,
    saveHandle,
    cancelHandle
}) => {
    const dispatch = useDispatch();
    const { allCaseData } = useSelector<StateTree, CaseDataState>((state) => state.caseData);
    const [formRef] = useForm<FormValue>();
    const [loading, setLoading] = useState(false);
    const [appSelectModalVisible, setAppSelectModalVisible] = useState(false);
    const [selectedApps, setSelectedApps] = useState<CloudApp[]>([]);
    const [activePanelKey, setActivePanelKey] = useState('0'); //当前
    const currentCase = useRef<CaseInfo>(); //当前案件数据
    const historyDeviceName = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENAME));
    const historyDeviceHolder = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER));
    const historyDeviceNumber = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER));
    const historyMobileNumber = useRef(UserHistory.get(HistoryKeys.HISTORY_MOBILENUMBER));

    useEffect(() => {
        dispatch({ type: 'caseData/queryAllCaseData' });
    }, []);

    useEffect(() => {
        historyDeviceName.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENAME);
        historyDeviceHolder.current = UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER);
        historyDeviceNumber.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER);
        historyMobileNumber.current = UserHistory.get(HistoryKeys.HISTORY_MOBILENUMBER);
    }, [visible]);

    useEffect(() => {
        if (visible) {
            formRef.setFieldsValue({ phoneName: device?.model ?? '' });
        }
    }, [device, visible]);

    useSubscribe(
        'protocol-read',
        (event: IpcRendererEvent, fetchData: FetchData, agree: boolean) => {
            const { cloudTimeout, cloudTimespan, isAlive } = fetchData;
            if (agree) {
                formRef.resetFields();
                setSelectedApps([]);
                setActivePanelKey('0');
                saveTimeToStorage(cloudTimeout!, cloudTimespan!, isAlive);
                saveHandle!(fetchData);
            }
        }
    );

    /**
     * 跳转到新增案件页
     */
    const toCaseAddView = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(routerRedux.push('/case-data/add?name=server-cloud-input'));
    };

    /**
     * 绑定案件下拉数据
     */
    const bindCaseSelect = () => {
        const { Option } = Select;
        return allCaseData.map((opt: CaseInfo) => {
            let pos = opt.m_strCaseName.lastIndexOf('\\');
            let [name, tick] = opt.m_strCaseName.substring(pos + 1).split('_');
            return <Option
                value={JSON.stringify(opt)}
                key={opt._id}>
                {`${name}（${helper
                    .parseDate(tick, 'YYYYMMDDHHmmss')
                    .format('YYYY-M-D H:mm:ss')}）`}
            </Option>;
        });
    };

    /**
     * 案件下拉Change
     */
    const caseChange = (value: string, option: JSX.Element | JSX.Element[]) => {
        currentCase.current = JSON.parse(value) as CaseInfo;
    };

    const resetValue = () => {
        currentCase.current = undefined;
        setSelectedApps([]);
        formRef.resetFields();
    };

    /**
     * App选择Handle
     * @param nodes 勾选的zTree结点
     */
    const appSelectHandle = (nodes: ITreeNode[]) => {
        const apps = filterToParseApp(nodes);
        setSelectedApps(apps);
        setAppSelectModalVisible(false);
    };

    /**
     * 表单提交
     */
    const formSubmit = async (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const { validateFields } = formRef;
        let entity = new FetchData(); //采集数据
        try {
            const values = await validateFields();
            if (selectedApps.length === 0) {
                message.destroy();
                message.info('请选择云取证App');
            } else {
                setLoading(true);
                entity.caseName = currentCase.current?.m_strCaseName;
                entity.spareName = currentCase.current?.spareName;
                entity.caseId = currentCase.current?._id;
                entity.casePath = currentCase.current?.m_strCasePath;
                entity.sdCard = currentCase.current?.sdCard ?? false;
                entity.hasReport = currentCase.current?.hasReport ?? false;
                entity.analysisApp = currentCase.current?.analysisApp ?? false;
                entity.trojan = currentCase.current?.trojan ?? false;
                entity.isAuto = currentCase.current?.m_bIsAutoParse;
                entity.unitName = currentCase.current?.m_strCheckUnitName;
                entity.mobileNumber = values.mobileNumber;
                entity.mobileName = `${values.phoneName}_${helper.timestamp(device?.usb)}`;
                entity.mobileNo = values.deviceNumber ?? '';
                entity.mobileHolder = values.user;
                entity.handleOfficerNo = values.handleOfficerNo;
                entity.note = values.note ?? '';
                entity.credential = '';
                entity.serial = device?.serial ?? '';
                entity.mode = DataMode.ServerCloud; //短信云取
                entity.appList = [];
                entity.cloudAppList = selectedApps; //云取App
                entity.cloudTimeout = values.cloudTimeout ?? getTimeFromStorage(LocalStoreKey.CloudTimeout);
                entity.cloudTimespan = values.cloudTimespan ?? getTimeFromStorage(LocalStoreKey.CloudTimespan);
                entity.isAlive = values.isAlive ?? false;

                // const disk = currentCase.current!.m_strCasePath.substring(0, 2);
                // const { free } = await helper.getDiskSpace(disk, true);
                ipcRenderer.send('show-protocol', entity);
                setLoading(false);
            }
        } catch (error) {
            console.warn(error);
            const fieldKeys = Object.keys(error);
            if (
                fieldKeys.some((i) => i === 'cloudTimeout') ||
                fieldKeys.some((i) => i === 'cloudTimespan')
            ) {
                setActivePanelKey('1');
            }
            // ipcRenderer.send('show-protocol', entity);
            setLoading(false);
        } finally {
            dispatch({ type: 'appSet/clearExtValue' });
        }
    };

    const renderForm = (): JSX.Element => {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };

        return <div>
            <Form form={formRef} layout="horizontal" {...formItemLayout}>
                <Row>
                    <Col span={24}>
                        <Item
                            rules={[{
                                required: true,
                                message: `请选择${caseText ?? '案件'}`
                            }]}
                            name="case"
                            label={`${caseText ?? '案件'}名称`}>
                            <Select
                                onChange={caseChange}
                                showSearch={true}
                                notFoundContent="暂无数据"
                                placeholder={`选择${caseText ?? '案件'}，可输入名称筛选`}>
                                {bindCaseSelect()}
                            </Select>
                        </Item>
                        <Item className="with-btn">
                            <Button
                                onClick={toCaseAddView}
                                type="primary"
                                size="small"
                                title={`添加${caseText ?? '案件'}`}
                            ><PlusSquareOutlined /></Button>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            label="选择App"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            required={true}>
                            <Button
                                onClick={() => setAppSelectModalVisible(true)}
                                style={{ width: '100%' }}>
                                <SelectOutlined />
                                <span>{`云${fetchText ?? '取证'}App（${selectedApps.length}）`}</span>
                            </Button>
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item rules={[
                            {
                                required: true,
                                message: '请填写手机号'
                            },
                            {
                                pattern: MobileNumber,
                                message: '请输入正确的手机号'
                            }
                        ]}
                            name="mobileNumber"
                            label="手机号"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}>
                            <AutoComplete
                                options={historyMobileNumber.current.reduce(
                                    (total: { value: string }[], current: string, index: number) => {
                                        if (index < 10 && current !== null) {
                                            total.push({ value: current });
                                        }
                                        return total;
                                    },
                                    []
                                )}>
                                <Input />
                            </AutoComplete>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item rules={[
                            {
                                required: true,
                                message: `请填写${devText ?? '设备'}名称`
                            },
                            {
                                pattern: Backslashe,
                                message: '不允许输入斜线字符'
                            },
                            { pattern: UnderLine, message: '不允许输入下划线' }
                        ]}
                            name="phoneName"
                            label={`${devText ?? '设备'}名称`}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}>
                            <AutoComplete
                                options={historyDeviceName.current.reduce(
                                    (total: { value: string }[], current: string, index: number) => {
                                        if (index < 10 && current !== null) {
                                            total.push({ value: current });
                                        }
                                        return total;
                                    },
                                    []
                                )}
                            />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写持有人'
                                },
                                {
                                    pattern: Backslashe,
                                    message: '不允许输入斜线字符'
                                }
                            ]}
                            name="user"
                            label="持有人"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}>
                            <AutoComplete
                                options={historyDeviceHolder.current.reduce(
                                    (total: { value: string }[], current: string, index: number) => {
                                        if (index < 10 && current !== null) {
                                            total.push({ value: current });
                                        }
                                        return total;
                                    },
                                    []
                                )}
                            />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item rules={[
                            {
                                pattern: Backslashe,
                                message: '不允许输入斜线字符'
                            },
                            {
                                pattern: UnderLine,
                                message: '不允许输入下划线'
                            }
                        ]}
                            name="deviceNumber"
                            label={`${devText ?? '设备'}编号`}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}>
                            <AutoComplete
                                options={historyDeviceNumber.current.reduce(
                                    (total: { value: string }[], current: string, index: number) => {
                                        if (index < 10 && current !== null) {
                                            total.push({ value: current });
                                        }
                                        return total;
                                    },
                                    []
                                )}>
                                <Input />
                            </AutoComplete>
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            name="handleOfficerNo"
                            label="检材持有人编号"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}>
                            <Input
                                maxLength={100}
                                placeholder="检材持有人编号/执法办案人员编号"
                            />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Item name="note" label="备注">
                            <Input maxLength={100} />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Collapse
                            onChange={(key) => {
                                setActivePanelKey(key as string);
                            }}
                            accordion={true}
                            activeKey={activePanelKey}>
                            <Panel
                                header={
                                    <PanelHeader
                                        onResetButtonHover={(e: MouseEvent) => {
                                            if (activePanelKey !== '1') {
                                                setActivePanelKey('1');
                                            }
                                        }}
                                        onResetClick={(e: MouseEvent) => {
                                            e.stopPropagation();
                                            formRef.setFieldsValue({
                                                cloudTimeout: helper.CLOUD_TIMEOUT,
                                                cloudTimespan: helper.CLOUD_TIMESPAN,
                                                isAlive: helper.IS_ALIVE
                                            });
                                            localStorage.removeItem(LocalStoreKey.CloudTimeout);
                                            localStorage.removeItem(
                                                LocalStoreKey.CloudTimespan
                                            );
                                            localStorage.removeItem(LocalStoreKey.IsAlive);
                                            message.destroy();
                                            message.success('已还原默认值');
                                        }}
                                    />
                                }
                                key="1"
                                className="ant-collapse-panel-overwrite">
                                <Row>
                                    <Col span={8}>
                                        <Item
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请填写超时时间'
                                                }
                                            ]}
                                            initialValue={getTimeFromStorage(
                                                LocalStoreKey.CloudTimeout
                                            )}
                                            name="cloudTimeout"
                                            label="超时时间（秒）"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 10 }}>
                                            <InputNumber
                                                min={0}
                                                precision={0}
                                                style={{ width: '100%' }}
                                            />
                                        </Item>
                                    </Col>
                                    <Col span={8}>
                                        <Item
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请填写查询间隔'
                                                }
                                            ]}
                                            initialValue={getTimeFromStorage(
                                                LocalStoreKey.CloudTimespan
                                            )}
                                            name="cloudTimespan"
                                            label="查询间隔（秒）"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 10 }}>
                                            <InputNumber
                                                min={0}
                                                precision={0}
                                                style={{ width: '100%' }}
                                            />
                                        </Item>
                                    </Col>
                                    <Col span={8}>
                                        <Item
                                            initialValue={getIsAliveFromStorage()}
                                            name="isAlive"
                                            valuePropName="checked"
                                            label="是否保活"
                                            tooltip="不要勾选，特殊需求用"
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 6 }}>
                                            <Checkbox />
                                        </Item>
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </Form>
        </div>;
    };

    return <>
        <Modal
            visible={visible}
            onCancel={() => {
                resetValue();
                setActivePanelKey('0');
                cancelHandle!();
            }}
            footer={[
                <Button
                    type="default"
                    key="B_0"
                    onClick={() => {
                        resetValue();
                        setActivePanelKey('0');
                        cancelHandle!();
                    }}>
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Tooltip title={`确定后开始${fetchText ?? '取证'}数据`} key="B_1">
                    <Button
                        type="primary"
                        disabled={loading}
                        onClick={formSubmit}>
                        {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        <span>确定</span>
                    </Button>
                </Tooltip>
            ]}
            title={`${fetchText ?? '取证'}信息录入（云取）`}
            width={1000}
            maskClosable={false}
            destroyOnClose={true}
            forceRender={true}
            centered={true}>
            <ServerCloudModalBox>{renderForm()}</ServerCloudModalBox>
        </Modal>
        <CloudAppSelectModal
            title={`云${fetchText ?? '取证'}App`}
            visible={appSelectModalVisible}
            url={cloudAppUrl ?? helper.FETCH_CLOUD_APP_URL}
            // url="http://localhost:9900/app/cloud-app"
            selectedKeys={selectedApps.map((i) => i.m_strID)}
            okHandle={appSelectHandle}
            closeHandle={() => setAppSelectModalVisible(false)}
        />
    </>;
};
ServerCloudModal.defaultProps = {
    visible: false,
    device: null,
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default ServerCloudModal
