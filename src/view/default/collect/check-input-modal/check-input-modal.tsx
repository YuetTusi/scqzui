import React, { FC, MouseEvent, useCallback, useRef, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import round from 'lodash/round';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';
import { StateTree } from '@/type/model';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import { Backslashe, UnderLine } from '@/utils/regex';
import { CaseInfo } from '@/schema/case-info';
import { FetchData } from '@/schema/fetch-data';
import { DataMode } from '@/schema/data-mode';
import Instruction from '../instruction';
import { CheckInputModalBox } from './styled/style';
import { FormValue, Prop } from './prop';
import { CheckInputModalState } from '@/model/default/check-input-modal';

const { caseText, devText, fetchText } = helper.readConf()!;
const { Option } = Select;
const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};

/**
 * 采集录入框（点验模式）
 */
const CheckInputModal: FC<Prop> = ({ device, visible, saveHandle, cancelHandle }) => {

    const dispatch = useDispatch();
    const { caseList } = useSelector<StateTree, CheckInputModalState>((state) => state.checkInputModal);
    const [formRef] = useForm<FormValue>();
    const currentCase = useRef<CaseInfo>(); //当前案件数据

    useEffect(() => {
        dispatch({ type: 'checkInputModal/queryCaseList' });
    }, []);

    /**
     * 跳转到新增案件页
     */
    const toCaseAddView = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(routerRedux.push('/case-data/add?name=check-input'));
    };

    /**
     * 绑定案件下拉数据
     */
    const bindCaseSelect = () => {
        return caseList.map((opt: CaseInfo) => {
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
    const caseChange = (value: string) => {
        currentCase.current = JSON.parse(value) as CaseInfo;
    };

    /**
     * 重置
     */
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
        let entity: FetchData | null = null;

        try {
            const values = await validateFields();
            entity = new FetchData(); //采集数据
            entity.caseName = currentCase.current?.m_strCaseName;
            entity.spareName = currentCase.current?.spareName;
            entity.caseId = currentCase.current?._id;
            entity.casePath = currentCase.current?.m_strCasePath;
            entity.sdCard = currentCase.current?.sdCard ?? false;
            entity.hasReport = currentCase.current?.hasReport ?? false;
            entity.isAuto = currentCase.current?.m_bIsAutoParse;
            entity.unitName = currentCase.current?.m_strCheckUnitName;
            entity.mobileName = `${values.phoneName}_${helper.timestamp(device?.usb)}`;
            entity.mobileNo = ''; //点验版本不需要填写编号
            entity.mobileHolder = values.user; //姓名
            entity.credential = values.credential; //身份证/军官证号
            entity.handleOfficerNo = '';
            entity.note = values.note; //设备手机号
            entity.serial = device?.serial ?? ''; //序列号
            entity.mode = DataMode.Check; //点验版本
            entity.appList = currentCase.current?.m_Applist ?? [];
            entity.cloudAppList = [];
        } catch (error) {
            console.clear();
            console.warn(error);
        }

        if (entity !== null) {
            try {
                let disk = currentCase.current?.m_strCasePath.substring(0, 2);
                const { free } = await helper.getDiskSpace(disk!, true);
                if (free < 100) {
                    Modal.confirm({
                        onOk() {
                            log.warn(`磁盘空间不足, ${disk}剩余: ${round(free, 2)}GB`);
                            //点验设备入库
                            dispatch({
                                type: 'checkInputModal/insertCheckData',
                                payload: entity
                            });
                            saveHandle(entity!);
                        },
                        title: '磁盘空间不足',
                        content: <Instruction>
                            <p>
                                磁盘空间仅存<strong>{round(free, 1)}GB</strong>
                                ，建议清理数据
                            </p>
                            <p>{`${devText ?? '设备'}数据过大可能会${fetchText ?? '取证'}失败，继续${fetchText ?? '取证'}？`}</p>
                        </Instruction>,
                        okText: '是',
                        cancelText: '否',
                        centered: true
                    });
                } else {
                    //点验设备入库
                    dispatch({ type: 'checkInputModal/insertCheckData', payload: entity });
                    saveHandle(entity);
                }
            } catch (error) {
                //点验设备入库
                dispatch({ type: 'checkInputModal/insertCheckData', payload: entity });
                saveHandle(entity);
                log.error(`读取磁盘信息失败:${(error as any).message}`);
            }
        }
    };

    const renderForm = (): JSX.Element => {

        return <div>
            <Form form={formRef} layout="horizontal" {...formItemLayout}>
                <Row>
                    <Col
                        span={24}>
                        <Item
                            rules={[
                                {
                                    required: true,
                                    message: `请选择${caseText ?? '案件'}`
                                }
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
                        <div className="with-btn">
                            <Button
                                onClick={toCaseAddView}
                                type="primary"
                                size="small"
                                title={`添加${caseText ?? '案件'}`}
                            >
                                <PlusCircleOutlined />
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写姓名'
                                },
                                {
                                    pattern: Backslashe,
                                    message: '不允许输入斜线字符'
                                }
                            ]}
                            name="user"
                            label="姓名"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 13 }}>
                            <Input />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写身份证/军官证号'
                                }
                            ]}
                            name="credential"
                            label="身份证/军官证号"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}>
                            <Input />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            rules={[
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
                            wrapperCol={{ span: 13 }}>
                            <Input />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写手机号'
                                }
                            ]}
                            name="note"
                            label="手机号"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}>
                            <Input maxLength={100} />
                        </Item>
                    </Col>
                </Row>
            </Form>
        </div>;
    };

    return <Modal
        visible={visible}
        onCancel={() => {
            resetValue();
            cancelHandle();
        }}
        footer={[
            <Button
                type="default"
                key="CIM_0"
                onClick={() => cancelHandle()}>
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Tooltip title={`确定后开始${fetchText ?? '取证'}数据`} key="CIM_1">
                <Button
                    type="primary"
                    onClick={formSubmit}>
                    <CheckCircleOutlined />
                    <span>确定</span>
                </Button>
            </Tooltip>
        ]}
        title={`${fetchText ?? '取证'}信息录入（点验）`}
        width={1000}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}>
        <CheckInputModalBox>{renderForm()}</CheckInputModalBox>
    </Modal>;
};
CheckInputModal.defaultProps = {
    visible: false,
    device: null,
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default memo(CheckInputModal, (prev: Prop, next: Prop) =>
    (!prev.visible && !next.visible)
);