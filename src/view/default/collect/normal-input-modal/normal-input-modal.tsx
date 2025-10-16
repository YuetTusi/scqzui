import round from 'lodash/round';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import SelectOutlined from '@ant-design/icons/SelectOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import AutoComplete from 'antd/lib/auto-complete';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';
import { ITreeNode } from '@/type/ztree';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { Backslashe, UnderLine } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { AppSelectModal, IMEIModal } from '@/component/dialog';
import Auth from '@/component/auth';
import { SocketType, CommandType } from '@/schema/command';
import { DeviceStoreState } from '@/model/default/device';
import { CaseInfo } from '@/schema/case-info';
import { FetchData } from '@/schema/fetch-data';
import { DataMode } from '@/schema/data-mode';
import { ParseApp } from '@/schema/parse-app';
import { DeviceSystem } from '@/schema/device-system';
import { BeforeFetchStatus } from '@/schema/before-fetch-status';
import { StateTree } from '@/type/model';
import { CaseDataState } from '@/model/default/case-data';
import { IMEIModalState } from '@/model/default/imei-modal';
import { NormalInputModalState } from '@/model/default/normal-input-modal';
import parseApp from '@/config/parse-app.yaml';
import { Instruction } from '../instruction';
import { NormalInputModalBox } from './styled/style';
import { Prop, FormValue } from './prop';

const { caseText, devText, fetchText, parseText, useBcp } = helper.readConf()!;
const { Option } = Select;
const { Item, useForm } = Form;

/**
 * 过滤勾选的node，返回level==2的应用结点
 * @param treeNode 勾选的zTree结点
 */
function filterToParseApp(treeNodes: ITreeNode[]) {
    return treeNodes
        .filter((node) => node.level == 2)
        .map((node) => {
            return new ParseApp({
                m_strID: node.id,
                m_strPktlist: node.packages
            });
        });
}

/**
 * 采集录入框（标准流程）
 */
const NormalInputModal: FC<Prop> = ({ saveHandle, cancelHandle }) => {

    const dispatch = useDispatch();
    const { allCaseData } = useSelector<StateTree, CaseDataState>((state) => state.caseData);
    const { deviceList } = useSelector<StateTree, DeviceStoreState>((state) => state.device);
    // const { types } = useSelector<StateTree, ExtractionState>((state) => state.extraction);
    const { open: imeiOpen } = useSelector<StateTree, IMEIModalState>((state) => state.imeiModal);
    const { open, fetchAllow, device } = useSelector<StateTree, NormalInputModalState>((state) => state.normalInputModal);
    const [formRef] = useForm<FormValue>();
    const currentCase = useRef<CaseInfo>(); //当前案件数据
    const [appSelectModalVisible, setAppSelectModalVisible] = useState(false);
    const [selectedApps, setSelectedApps] = useState<ParseApp[]>([]);
    const methodValue = useRef<string | undefined>(''); //记住用户选择的提取方式
    const historyDeviceName = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENAME));
    const historyDeviceHolder = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER));
    const historyDeviceNumber = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER));
    const [isExtraction, setIsExtraction] = useState<boolean>(false); //是否启用“提取方式” 目前用于方便调试
    // const [isWired, setIsWired] = useState<boolean>(false); //是否启用“有线方式” 目前用于方便调试

    useEffect(() => {
        dispatch({ type: 'caseData/queryAllCaseData' });
    }, []);

    useEffect(() => {
        (async () => {
            if (open) {
                const extraction = await helper.isExtraction()
                setIsExtraction(extraction);
            }
        })();
    }, [open]);

    useEffect(() => {
        historyDeviceName.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENAME);
        historyDeviceHolder.current = UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER);
        historyDeviceNumber.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER);
    }, [open]);

    useEffect(() => {
        if (open) {
            const methods = device?.methods ?? [];
            formRef.setFieldsValue({
                extraction: methods.length === 0 ? undefined : methods[0].value
            });
        }
    }, [open, device?.methods]);

    useEffect(() => {

        if (open && useBcp) {
            const phoneInfo = deviceList[device?.usb! - 1]?.phoneInfo ?? [];
            let values: Record<string, any> = {
                phoneName: device?.model ?? ''
            };

            phoneInfo.forEach((i) => {
                switch (i.name.toLocaleLowerCase()) {
                    case 'imei1':
                        values.imei1 = i.value;
                        break;
                    case 'imei2':
                        values.imei2 = i.value;
                        break;
                    case 'meid':
                        values.meid = i.value;
                        break;
                }
            });
            formRef.setFieldsValue(values);
        }
    }, [deviceList, useBcp, open]);

    /**
     * 跳转到新增案件页
     */
    const toCaseAddView = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(routerRedux.push('/case-data/add?name=case-input'));
    };

    /**
     * 绑定案件下拉数据
     */
    const bindCaseSelect = () => allCaseData.map((opt: any) => {
        let pos = opt.m_strCaseName.lastIndexOf('\\');
        let [name, tick] = opt.m_strCaseName.substring(pos + 1).split('_');
        return <Option
            value={JSON.stringify(opt)}
            key={opt._id}
            style={{ color: opt.wired ? '#f9ca24' : '#ffffffd9' }}>
            {opt.wired ? <FontAwesomeIcon icon={faBolt} style={{ marginRight: '4px' }} /> : null}
            {`${name}（${helper
                .parseDate(tick, 'YYYYMMDDHHmmss')
                .format('YYYY-M-D H:mm:ss')}）`}
        </Option>;
    });

    /**
     * 绑定提取方式下拉
     */
    const bindExtractionSelect = () => {
        if (helper.isNullOrUndefined(device)) {
            return null;
        } else {
            return (device.methods ?? [])
                .map((t) => <Option
                    title={t.tip ?? t.name}
                    value={t.value}
                    key={`${t.name}_${t.value}`}>
                    {t.name}
                </Option>);
        }
    };

    /**
     * 案件下拉Change
     */
    const caseChange = (value: string, _: JSX.Element | JSX.Element[]) => {
        const methods = device?.methods ?? [];
        currentCase.current = JSON.parse(value) as CaseInfo;
        if (currentCase.current.wired) {
            //是有线快采案件，则自动选择`Apk快速采集`提取方式
            const apk = methods.find(item => item.name === 'Apk快速采集');
            if (apk) {
                formRef.setFieldsValue({ extraction: apk.value });
            }
        }
    };

    /**
     * 提取方式下拉Change
     */
    const extractionChange = (value: string) => {
        formRef.validateFields(['case']);
        methodValue.current = value;
    };

    /**
     * 查询手机IMEI/MEID值
     */
    const onIMEIOrMEIDSearch = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        dispatch({
            type: 'appSet/setReading',
            payload: {
                reading: true,
                readingMessage: '获取中'
            }
        });
        //使用倒计时
        dispatch({ type: 'appSet/setCountDown', payload: true });
        send(SocketType.Fetch, {
            cmd: CommandType.IMEI,
            msg: { usb: device?.usb ?? 0 }
        });
    }

    /**
     * App选择Handle
     * @param nodes 勾选的zTree结点
     */
    const appSelectHandle = (nodes: ITreeNode[]) => {
        const apps = filterToParseApp(nodes);
        setSelectedApps(apps);
        setAppSelectModalVisible(false);
    };

    const resetValue = () => {
        currentCase.current = undefined;
        formRef.resetFields();
    };

    /**
     * 表单提交
     */
    const formSubmit = async (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const { validateFields } = formRef;

        try {
            const values = await validateFields();
            let entity = new FetchData(); //采集数据
            entity.caseName = currentCase.current?.m_strCaseName;
            entity.spareName = currentCase.current?.spareName;
            entity.caseId = currentCase.current?._id;
            entity.casePath = currentCase.current?.m_strCasePath;
            entity.analysisApp = currentCase.current?.analysisApp ?? true;
            entity.sdCard = currentCase.current?.sdCard ?? false;
            entity.hasReport = currentCase.current?.hasReport ?? false;
            entity.isAuto = currentCase.current?.m_bIsAutoParse;
            entity.unitName = currentCase.current?.m_strCheckUnitName;
            entity.isAi = currentCase.current?.isAi ?? false;
            entity.ruleFrom = currentCase.current?.ruleFrom ?? 0;
            entity.ruleTo = currentCase.current?.ruleTo ?? 8;
            entity.mobileName = `${values.phoneName}_${helper.timestamp(device?.usb)}`;
            entity.mobileNo = values.deviceNumber ?? '';
            entity.mobileHolder = values.user;
            entity.handleOfficerNo = values.handleOfficerNo;
            entity.note = values.note ?? '';
            entity.extraction = values.extraction;
            entity.wired = values.wired ?? false;
            entity.credential = '';
            entity.serial = device?.serial ?? '';
            entity.mode = DataMode.Self; //标准模式（用户手输取证数据）
            entity.appList = selectedApps.length === 0 ? currentCase.current?.m_Applist : selectedApps; //若未选择解析应用，以案件配置的应用为准
            entity.cloudAppList = [];
            entity.imei1 = values.imei1 ?? '';
            entity.imei2 = values.imei2 ?? '';
            entity.meid = values.meid ?? '';

            if (useBcp && device!.system === DeviceSystem.Android && entity.imei1 === '' && entity.imei2 === '' && entity.meid === '') {
                //如果有BCP功能，IMEI/IMID必须填写一项
                Modal.warn({
                    title: '提示',
                    content: 'IMEI1 IMEI2 IMID 请填写其中一个',
                    okText: '确定',
                    centered: true
                });
                return;
            }

            try {
                const disk = helper.os() === 'linux'
                    ? currentCase.current!.m_strCasePath
                    : currentCase.current!.m_strCasePath.substring(0, 2);
                const { free } = await helper.getDiskSpace(disk, true);
                if (free < 100) {
                    Modal.confirm({
                        onOk() {
                            log.warn(`磁盘空间不足, ${disk}剩余: ${round(free, 2)}GB`);
                            saveHandle!(entity);
                        },
                        title: '磁盘空间不足',
                        content: <Instruction>
                            <p>
                                磁盘空间仅存<strong>{round(free, 1)}GB</strong>
                                ，建议清理数据
                            </p>
                            <p>设备数据过大可能会采集失败，继续取证？</p>
                        </Instruction>,
                        okText: '是',
                        cancelText: '否',
                        icon: <InfoCircleOutlined />,
                        centered: true
                    });
                } else {
                    setSelectedApps([]);
                    // resetValue();
                    saveHandle!(entity);
                }
            } catch (error) {
                setSelectedApps([]);
                // resetValue();
                saveHandle!(entity);
                log.error(`读取磁盘信息失败:${error.message}`);
            }

        } catch (error) {
            console.warn(error);
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
                        <Item rules={[
                            {
                                required: true,
                                message: `请选择${caseText ?? '案件'}`
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!isExtraction) {
                                        return Promise.resolve();
                                    }
                                    if (value === undefined) {
                                        return Promise.resolve();
                                    }
                                    const currentCase: CaseInfo = JSON.parse(value);
                                    const extractionValue = getFieldValue('extraction');
                                    const extraction = (device.methods ?? []).find(i => i.value == extractionValue);
                                    if (currentCase.wired) {
                                        return extraction?.name === 'Apk快速采集'
                                            ? Promise.resolve()
                                            : Promise.reject(new Error(`有线快采${caseText ?? '案件'}请选择「Apk快速采集」`));
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            })
                        ]}
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
                            ><PlusCircleOutlined /></Button>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item label="选择App" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                            <Button
                                onClick={() => setAppSelectModalVisible(true)}
                                style={{ width: '100%' }}>
                                <SelectOutlined />
                                <span>{`${parseText ?? '解析'}App（${selectedApps.length}）`}</span>
                            </Button>
                        </Item>
                    </Col>
                    <Col span={12}>
                        <div className="app-tips">
                            <InfoCircleOutlined />
                            <span>{`未选择App以「所属${caseText ?? '案件'}配置」为准`}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            name="phoneName"
                            rules={[{
                                required: true,
                                message: `请填写${devText ?? '设备'}名称`
                            },
                            {
                                pattern: Backslashe,
                                message: '不允许输入斜线字符'
                            },
                            { pattern: UnderLine, message: '不允许输入下划线' }]}
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
                            name="user"
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
                        <Item
                            name="deviceNumber"
                            rules={[
                                {
                                    pattern: Backslashe,
                                    message: '不允许输入斜线字符'
                                },
                                { pattern: UnderLine, message: '不允许输入下划线' }
                            ]}
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
                <Auth deny={!useBcp}>
                    <Row>
                        <Col span={12}>
                            <Item
                                name="imei1"
                                label="IMEI1"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}>
                                <Input
                                    placeholder="15位数字"
                                    maxLength={15} />
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                name="imei2"
                                label="IMEI2"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}>
                                <Input
                                    placeholder="15位数字"
                                    maxLength={15} />
                            </Item>
                        </Col>
                    </Row>
                </Auth>
                <Row>
                    <Auth deny={!useBcp}>
                        <Col span={12}>
                            <Item
                                name="meid"
                                label="MEID"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}>
                                <Input
                                    placeholder="15位数字"
                                    maxLength={15} />
                            </Item>
                        </Col>
                    </Auth>
                    <Auth deny={!useBcp}>
                        <Col span={12}>
                            <Button
                                onClick={onIMEIOrMEIDSearch}
                                size="small"
                                type="primary"
                                style={{
                                    display: device?.system === DeviceSystem.IOS ? 'none' : 'block',
                                    position: 'relative',
                                    top: '4px'
                                }}>
                                <SearchOutlined />
                                <span>尝试获取IMEI/MEID</span>
                            </Button>
                        </Col>
                    </Auth>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            name="note"
                            label="备注"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}>
                            <Input maxLength={100} />
                        </Item>
                    </Col>
                    <Auth deny={!isExtraction}>
                        <Col span={12}>
                            <Item
                                rules={[{
                                    required: true,
                                    message: '请选择提取方式'
                                }]}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                name="extraction"
                                label="提取方式">
                                <Select
                                    onChange={extractionChange}
                                    style={{ width: '100%' }}>
                                    {bindExtractionSelect()}
                                </Select>
                            </Item>
                        </Col>
                    </Auth>
                </Row>
                {/* <Auth deny={!isWired}>
                    <Row>
                        <Col span={12}>
                            <Item
                                name="wired"
                                label="有线快速采集"
                                valuePropName="checked"
                                initialValue={true}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}>
                                <Checkbox />
                            </Item>
                        </Col>
                        <Col span={12} />
                    </Row>
                </Auth> */}
            </Form>
        </div >;
    };

    return <>
        <Modal
            open={open}
            onCancel={() => {
                resetValue();
                setSelectedApps([]);
                dispatch({ type: 'normalInputModal/setFetchAllow', payload: BeforeFetchStatus.Unverified });
                cancelHandle!();
            }}
            footer={[
                <Button
                    type="default"
                    key="B_0"
                    onClick={() => {
                        setSelectedApps([]);
                        resetValue();
                        dispatch({ type: 'normalInputModal/setFetchAllow', payload: BeforeFetchStatus.Unverified });
                        cancelHandle!();
                    }}>
                    <CloseCircleOutlined />
                    <span>取消</span>
                </Button>,
                <Tooltip title={`确定后开始${fetchText ?? '取证'}数据`} key="B_1">
                    <Button
                        onClick={formSubmit}
                        disabled={fetchAllow === BeforeFetchStatus.Verifying}
                        type="primary"
                        style={{ marginLeft: '8px' }}>
                        {fetchAllow === BeforeFetchStatus.Verifying ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        <span>确定</span>
                    </Button>
                </Tooltip>
            ]}
            title={`${fetchText ?? '取证'}信息录入`}
            width={1000}
            maskClosable={false}
            destroyOnClose={true}
            forceRender={true}
            centered={true}>
            <NormalInputModalBox>{renderForm()}</NormalInputModalBox>
        </Modal>
        <AppSelectModal
            title={`${parseText ?? '解析'}App`}
            visible={appSelectModalVisible}
            treeData={parseApp.fetch}
            selectedKeys={selectedApps.map((i) => i.m_strID)}
            okHandle={appSelectHandle}
            closeHandle={() => setAppSelectModalVisible(false)}
        />
        <IMEIModal
            open={imeiOpen}
            onCancel={() => dispatch({ type: 'imeiModal/setOpen', payload: false })} />
    </>;
};
NormalInputModal.defaultProps = {
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default NormalInputModal;