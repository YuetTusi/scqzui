import React, { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import round from 'lodash/round';
import SelectOutlined from '@ant-design/icons/SelectOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import AutoComplete from 'antd/lib/auto-complete';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';
import { StateTree } from '@/type/model';
import { NormalInputModalStoreState } from '@/model/default/normal-input-modal';
import { ITreeNode } from '@/type/ztree';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { Backslashe, UnderLine } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { AppSelectModal } from '@/component/dialog';
import { CaseInfo } from '@/schema/case-info';
import FetchData from '@/schema/fetch-data';
import { DataMode } from '@/schema/data-mode';
import { ParseApp } from '@/schema/parse-app';
import parseApp from '@/config/parse-app.yaml';
import Instruction from './instruction';
import { NormalInputModalBox } from './styled/style';
import { Prop, FormValue } from './prop';

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
const NormalInputModal: FC<Prop> = (props) => {

    const dispatch = useDispatch();
    const normalInputModal = useSelector<StateTree, NormalInputModalStoreState>(state => state.normalInputModal);
    const [formRef] = useForm<FormValue>();
    const caseId = useRef<string>(''); //案件id
    const spareName = useRef<string>(''); //案件备用名
    const casePath = useRef<string>(''); //案件存储路径
    const appList = useRef<any[]>([]); //解析App
    const sdCard = useRef<boolean>(false); //是否拉取SD卡
    const hasReport = useRef<boolean>(false); //是否生成报告
    const isAuto = useRef<boolean>(false); //是否自动解析
    const unitName = useRef<string>(''); //检验单位
    const [appSelectModalVisible, setAppSelectModalVisible] = useState(false);
    const [selectedApps, setSelectedApps] = useState<ParseApp[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const historyDeviceName = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENAME));
    const historyDeviceHolder = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER));
    const historyDeviceNumber = useRef(UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER));

    useEffect(() => {
        dispatch({ type: 'normalInputModal/queryCaseList' });
    }, []);

    useEffect(() => {
        historyDeviceName.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENAME);
        historyDeviceHolder.current = UserHistory.get(HistoryKeys.HISTORY_DEVICEHOLDER);
        historyDeviceNumber.current = UserHistory.get(HistoryKeys.HISTORY_DEVICENUMBER);
    }, [props.visible]);

    /**
     * 跳转到新增案件页
     */
    const toCaseAddView = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(routerRedux.push('/case/case-add?name=case-input'));
    };

    /**
     * 绑定案件下拉数据
     */
    const bindCaseSelect = () => {
        const { caseList } = normalInputModal;
        const { Option } = Select;
        return caseList.map((opt: CaseInfo) => {
            let pos = opt.m_strCaseName.lastIndexOf('\\');
            let [name, tick] = opt.m_strCaseName.substring(pos + 1).split('_');
            return (
                <Option
                    value={opt.m_strCaseName.substring(pos + 1)}
                    data-case-id={opt._id}
                    data-spare-name={opt.spareName ?? ''}
                    data-case-path={opt.m_strCasePath}
                    data-app-list={opt.m_Applist}
                    data-sdcard={opt.sdCard}
                    data-has-report={opt.hasReport}
                    data-is-auto={opt.m_bIsAutoParse}
                    data-unitname={opt.m_strCheckUnitName}
                    key={opt._id}>
                    {`${name}（${helper
                        .parseDate(tick, 'YYYYMMDDHHmmss')
                        .format('YYYY-M-D H:mm:ss')}）`}
                </Option>
            );
        });
    };

    /**
     * 案件下拉Change
     */
    const caseChange = (value: string, option: JSX.Element | JSX.Element[]) => {
        caseId.current = (option as JSX.Element).props['data-case-id'] as string;
        spareName.current = (option as JSX.Element).props['data-spare-name'] as string;
        casePath.current = (option as JSX.Element).props['data-case-path'] as string;
        appList.current = (option as JSX.Element).props['data-app-list'] as any[];
        isAuto.current = (option as JSX.Element).props['data-is-auto'] as boolean;
        sdCard.current = (option as JSX.Element).props['data-sdcard'] as boolean;
        hasReport.current = (option as JSX.Element).props['data-has-report'] as boolean;
        unitName.current = (option as JSX.Element).props['data-unitname'] as string;
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

    const resetValue = useCallback(() => {
        caseId.current = ''; //案件id
        spareName.current = ''; //案件备用名
        casePath.current = ''; //案件存储路径
        appList.current = []; //解析App
        sdCard.current = false; //是否拉取SD卡
        hasReport.current = false; //是否生成报告
        isAuto.current = false; //是否自动解析
        unitName.current = ''; //检验单位
    }, []);

    /**
     * 表单提交
     */
    const formSubmit = async (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const { validateFields } = formRef;
        const { saveHandle, device } = props;

        try {
            const values = await validateFields();
            setLoading(true);
            let entity = new FetchData(); //采集数据
            entity.caseName = values.case;
            entity.spareName = spareName.current;
            entity.caseId = caseId.current;
            entity.casePath = casePath.current;
            entity.sdCard = sdCard.current ?? false;
            entity.hasReport = hasReport.current ?? false;
            entity.isAuto = isAuto.current;
            entity.unitName = unitName.current;
            entity.mobileName = `${values.phoneName}_${helper.timestamp(device?.usb)}`;
            entity.mobileNo = values.deviceNumber ?? '';
            entity.mobileHolder = values.user;
            entity.handleOfficerNo = values.handleOfficerNo;
            entity.note = values.note ?? '';
            entity.credential = '';
            entity.serial = props.device?.serial ?? '';
            entity.mode = DataMode.Self; //标准模式（用户手输取证数据）
            entity.appList = selectedApps.length === 0 ? appList.current : selectedApps; //若未选择解析应用，以案件配置的应用为准
            entity.cloudAppList = [];

            try {
                let disk = casePath.current.substring(0, 2);
                const { FreeSpace } = await helper.getDiskInfo(disk, true);
                if (FreeSpace < 100) {
                    Modal.confirm({
                        onOk() {
                            log.warn(`磁盘空间不足, ${disk}剩余: ${round(FreeSpace, 2)}GB`);
                            saveHandle!(entity);
                        },
                        title: '磁盘空间不足',
                        content: (
                            <Instruction>
                                <>
                                    <p>
                                        磁盘空间仅存<strong>{round(FreeSpace, 1)}GB</strong>
                                        ，建议清理数据
                                    </p>
                                    <p>设备数据过大可能会采集失败，继续取证？</p>
                                </>
                            </Instruction>
                        ),
                        okText: '是',
                        cancelText: '否',
                        icon: 'info-circle',
                        centered: true
                    });
                } else {
                    saveHandle!(entity);
                }
            } catch (error) {
                saveHandle!(entity);
                log.error(`读取磁盘信息失败:${(error as any).message}`);
            } finally {
                setLoading(false);
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

        return (
            <div>
                <Form form={formRef} layout="horizontal" {...formItemLayout}>
                    <Row>
                        <Col span={24}>
                            <Item rules={[
                                {
                                    required: true,
                                    message: '请选择案件'
                                }
                            ]} name="case" label="案件名称">
                                <Select
                                    onChange={caseChange}
                                    showSearch={true}
                                    notFoundContent="暂无数据"
                                    placeholder="选择案件，可输入案件名称筛选">
                                    {bindCaseSelect()}
                                </Select>
                            </Item>
                            <Item className="with-btn">
                                <Button
                                    onClick={toCaseAddView}
                                    type="primary"
                                    size="small"
                                    title="添加案件"
                                ><PlusSquareOutlined /></Button>
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
                                    <span>{`解析App（${selectedApps.length}）`}</span>
                                </Button>
                            </Item>
                        </Col>
                        <Col span={12}>
                            <div className="app-tips">未选择App以「所属案件配置」为准</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                name="phoneName"
                                rules={[{
                                    required: true,
                                    message: '请填写手机名称'
                                },
                                {
                                    pattern: Backslashe,
                                    message: '不允许输入斜线字符'
                                },
                                { pattern: UnderLine, message: '不允许输入下划线' }]}
                                initialValue={props.device?.model}
                                label="手机名称"
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
                                label="手机持有人"
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
                                label="手机编号"
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
                                    <Input maxLength={3} />
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
                </Form>
            </div>
        );
    };

    return (
        <>
            <Modal
                visible={props.visible}
                onCancel={() => {
                    resetValue();
                    setSelectedApps([]);
                    props.cancelHandle!();
                }}
                footer={[
                    <Button
                        type="default"
                        key="B_0"
                        onClick={() => {
                            setSelectedApps([]);
                            props.cancelHandle!();
                        }}>
                        <CloseCircleOutlined />
                        <span>取消</span>
                    </Button>,
                    <Tooltip title="确定后开始采集数据" key="B_1">
                        <Button
                            onClick={formSubmit}
                            disabled={loading}
                            type="primary">
                            {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                            <span>确定</span>
                        </Button>
                    </Tooltip>
                ]}
                title="取证信息录入"
                width={1000}
                maskClosable={false}
                destroyOnClose={true}
                centered={true}>
                <NormalInputModalBox>{renderForm()}</NormalInputModalBox>
            </Modal>
            <AppSelectModal
                title="解析App"
                visible={appSelectModalVisible}
                treeData={parseApp.fetch}
                selectedKeys={selectedApps.map((i) => i.m_strID)}
                okHandle={appSelectHandle}
                closeHandle={() => setAppSelectModalVisible(false)}
            />
        </>
    );
};
NormalInputModal.defaultProps = {
    visible: false,
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default NormalInputModal;