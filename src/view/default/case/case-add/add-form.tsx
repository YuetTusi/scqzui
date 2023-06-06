import throttle from 'lodash/throttle';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import React, { FC, MouseEvent, useEffect, useRef, useState, useCallback } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import FileSyncOutlined from '@ant-design/icons/FileSyncOutlined'
import CloudSyncOutlined from '@ant-design/icons/CloudSyncOutlined'
import SelectOutlined from '@ant-design/icons/SelectOutlined'
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Form, { RuleObject } from 'antd/lib/form';
import Empty from 'antd/lib/empty';
import Input, { InputRef } from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import Tooltip from 'antd/lib/tooltip';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { useOfficerList } from '@/hook';
import { helper } from '@/utils/helper';
import { AllowCaseName } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { caseType } from '@/schema/case-type';
import { AttachmentType } from '@/schema/bcp-entity';
import parseAppData from '@/config/parse-app.yaml';
import tokenAppData from '@/config/token-app.yaml';
import Auth from '@/component/auth';
import { Split } from '@/component/style-tool';
import { AppSelectModal } from '@/component/dialog';
import { filterToParseApp } from '../helper';
import { FormBox } from './styled/styled';
import AiSwitch from '../ai-switch';
import { FormProp } from './prop';

const { Group } = Button;
const { Search } = Input;
const { Item } = Form;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};
const { useBcp, useAi, caseText, fetchText, parseText } = helper.readConf()!;


/**
 * 案件表单（添加）
 */
const AddForm: FC<FormProp> = ({
    formRef, sdCardState, hasReportState, autoParseState, generateBcpState,
    isDelState, isAiState, parseAppListState, tokenAppListState
}) => {
    const [isCheck, setIsCheck] = useState(false);
    const [parseAppSelectModalVisible, setParseAppSelectModalVisible] =
        useState<boolean>(false); //解析App选择框
    const [tokenAppSelectModalVisible, setTokenAppSelectModalVisible] =
        useState<boolean>(false); //云取证App选择框
    const caseNameRef = useRef<InputRef>(null);
    const [sdCard, setSdCard] = sdCardState;
    const [hasReport, setHasReport] = hasReportState;
    const [autoParse, setAutoParse] = autoParseState;
    const [generateBcp, setGenerateBcp] = generateBcpState;
    const [isDel, setIsDel] = isDelState;
    const [isAi, setIsAi] = isAiState;
    const [parseAppList, setParseAppList] = parseAppListState;
    const [tokenAppList, setTokenAppList] = tokenAppListState;
    const historyUnitNames = UserHistory.get(HistoryKeys.HISTORY_UNITNAME);
    const officer = useOfficerList();

    useEffect(() => {
        if (caseNameRef.current) {
            caseNameRef.current.focus();
        }
    }, []);

    /**
     * 选择案件路径Handle
     */
    const selectDirHandle = useCallback((event: MouseEvent<HTMLInputElement>) => {
        const { setFieldsValue } = formRef;
        ipcRenderer
            .invoke('open-dialog', {
                properties: ['openDirectory']
            })
            .then((val: OpenDialogReturnValue) => {
                if (val.filePaths && val.filePaths.length > 0) {
                    setFieldsValue({ m_strCasePath: val.filePaths[0] });
                }
            });
    }, []);

    /**
     * 验证案件重名
     */
    const validCaseNameExists = throttle(async (rule: any, value: string) => {
        setIsCheck(true);
        let next = value === '..' ? '.' : value;
        try {
            const { length } = await helper.caseNameExist(next);
            if (length > 0) {
                throw new Error(`${caseText ?? '案件'}名称已存在`);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsCheck(false);
        }
    }, 400);

    const ruleToValid = async (rule: RuleObject, value: any) => {
        const from = formRef.getFieldValue('ruleFrom');
        if (from === value) {
            throw new Error('不要等于起始时段');
        }
    };

    return <FormBox>
        <Form form={formRef} {...formItemLayout}>
            <Row>
                <Col span={24}>
                    <Item rules={[
                        { required: true, message: `请填写${caseText ?? '案件'}名称` },
                        { pattern: AllowCaseName, message: '不允许输入非法字符' },
                        {
                            validator: validCaseNameExists,
                            message: `${caseText ?? '案件'}名称已存在`
                        }
                    ]}
                        name="currentCaseName"
                        label={`${caseText ?? '案件'}名称`}>
                        <Search ref={caseNameRef} maxLength={30} loading={isCheck} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item rules={[
                        {
                            required: true,
                            message: '请选择存储位置'
                        }
                    ]}
                        name="m_strCasePath"
                        label="存储位置">
                        <Input
                            suffix={<SelectOutlined onClick={selectDirHandle} />}
                            readOnly={true}
                            placeholder="请选择存储位置"
                            onClick={selectDirHandle}
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item
                        initialValue={helper.isNullOrUndefined(historyUnitNames) ||
                            historyUnitNames.length === 0
                            ? ''
                            : historyUnitNames[0]}
                        rules={[{ required: true, message: '请填写检验单位' }]}
                        name="checkUnitName"
                        label="检验单位">
                        <AutoComplete
                            options={helper.isNullOrUndefined(historyUnitNames)
                                ? []
                                : historyUnitNames.reduce(
                                    (
                                        total: { value: string }[],
                                        current: string,
                                        index: number
                                    ) => {
                                        if (
                                            index < 10 &&
                                            !helper.isNullOrUndefinedOrEmptyString(
                                                current
                                            )
                                        ) {
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
                <Col span={24}>
                    <Row>
                        <Col span={12}>
                            <Item
                                name="ruleFrom"
                                label="违规时段 起"
                                rules={[
                                    { required: true, message: '请填写违规时段' }
                                ]}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}>
                                <InputNumber min={0} max={24} style={{ width: '100%' }} />
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                name="ruleTo"
                                label="违规时段 止"
                                rules={[
                                    { required: true, message: '请填写违规时段' },
                                    { validator: ruleToValid }
                                ]}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}>
                                <InputNumber min={0} max={24} style={{ width: '100%' }} />
                            </Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item label="选择App">
                        <Group>
                            <Button
                                onClick={() => setParseAppSelectModalVisible(true)}
                                style={{ width: 200 }}>
                                <FileSyncOutlined />
                                <span>{`${parseText ?? '解析'}App（${parseAppList.length}）`}</span>
                            </Button>
                            <Button
                                onClick={() => setTokenAppSelectModalVisible(true)}
                                style={{ width: 200 }}>
                                <CloudSyncOutlined />
                                <span>{`Token云${fetchText ?? '取证'}App（${tokenAppList.length}）`}</span>
                            </Button>
                        </Group>
                    </Item>
                </Col>
            </Row>
            <Split />
            <Row style={{ paddingTop: '30px' }}>
                <Col offset={2} span={3}>
                    <span>拉取SD卡：</span>
                    <Checkbox onChange={(event) => setSdCard(event.target.checked)} checked={sdCard} />
                </Col>
                <Col span={3}>
                    <span>生成报告：</span>
                    <Checkbox onChange={(event) => setHasReport(event.target.checked)} checked={hasReport} />
                </Col>
                <Col span={3}>
                    <span>{`自动${parseText ?? '解析'}：`}</span>
                    <Tooltip title={`勾选后, ${fetchText ?? '取证'}完成将自动${parseText ?? '解析'}应用数据`}>
                        <Checkbox onChange={(event) => {
                            const { checked } = event.target;
                            if (!checked) {
                                setGenerateBcp(false);
                                // setAttachment(false);
                            }
                            setAutoParse(checked);
                        }}
                            checked={autoParse} />
                    </Tooltip>
                </Col>
                <Auth deny={!useBcp}>
                    <Col span={3}>
                        <span>生成BCP：</span>
                        <Checkbox
                            onChange={(event) => {
                                // const { checked } = event.target;
                                // if (!checked) {
                                //     setAttachment(false);
                                // }
                                setGenerateBcp(event.target.checked);
                            }}
                            checked={generateBcp}
                            disabled={!autoParse}
                        />
                    </Col>
                    {/* <Col span={3}>
                        <span>BCP包含附件：</span>
                        <Checkbox
                            onChange={(event) => setAttachment(event.target.checked)}
                            checked={attachment}
                            disabled={!generateBcp}
                        />
                    </Col> */}
                </Auth>
                <Col span={3}>
                    <span>删除原数据：</span>
                    <Tooltip title="解析结束自动删除原始数据，可节省磁盘空间，不可再次重新解析">
                        <Checkbox onChange={(event) => setIsDel(event.target.checked)} checked={isDel} />
                    </Tooltip>
                </Col>
                <Auth deny={!useAi}>
                    <Col span={3}>
                        <span>AI分析：</span>
                        <Checkbox onChange={(event) => setIsAi(event.target.checked)} checked={isAi} />
                    </Col>
                </Auth>
            </Row>
            <div
                className="cate"
                style={{ display: useBcp && generateBcp ? 'block' : 'none' }}>
                <div className="cate-bar">
                    <FontAwesomeIcon icon={faAnglesDown} />
                    <span>BCP信息</span>
                </div>
                <Row style={{ marginTop: '30px' }}>
                    <Col span={12}>
                        <Item
                            name="attachment"
                            label="BCP附件"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            initialValue={AttachmentType.Nothing}>
                            <Radio.Group>
                                <Radio value={AttachmentType.Nothing}>无附件</Radio>
                                <Radio value={AttachmentType.Audio}>语音附件</Radio>
                                <Radio value={AttachmentType.Media}>语音，图片，视频附件</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: generateBcp,
                                    message: `请选择${fetchText ?? '取证'}人员`
                                }
                            ]}
                            name="officerNo"
                            tooltip={`无相关人员请在「软件设置」→「${fetchText ?? '取证'}人员信息」中添加`}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            label={`${fetchText ?? '取证'}人员`}>
                            <Select
                                notFoundContent={
                                    <Empty
                                        description={`暂无${fetchText ?? '取证'}人员`}
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                }>
                                {helper.arrayToOptions(officer, 'name', 'no')}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={12} />
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            name="securityCaseNo"
                            label="网安部门案件编号"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}>
                            <Input />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            initialValue={''}
                            name="securityCaseType"
                            label="网安部门案件类别"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}>
                            <Select>{helper.arrayToOptions(caseType)}</Select>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Item
                            name="securityCaseName"
                            label="网安部门案件名称"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}>
                            <Input />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            name="handleCaseNo"
                            label="执法办案系统案件编号"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}>
                            <Input />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item
                            name="handleCaseType"
                            label="执法办案系统案件类别"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}>
                            <Input />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Item
                            name="handleCaseName"
                            label="执法办案系统案件名称"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}>
                            <Input />
                        </Item>
                    </Col>
                </Row>
            </div>
            <div className="cate" style={{ display: useAi && isAi ? 'block' : 'none' }}>
                <div className="cate-bar">
                    <FontAwesomeIcon icon={faAnglesDown} />
                    <span>AI信息</span>
                </div>
                <Row>
                    <Col span={2} />
                    <Col span={20}>
                        <AiSwitch />
                    </Col>
                    <Col span={2} />
                </Row>
            </div>
        </Form>
        {/* 解析App选择框 */}
        <AppSelectModal
            visible={parseAppSelectModalVisible}
            treeId="parseAppTree"
            treeData={parseAppData.fetch}
            selectedKeys={parseAppList.map((i) => i.m_strID)}
            okHandle={(data) => {
                const selectApps = filterToParseApp(data);
                setParseAppList(selectApps);
                // context.parseAppSelectHandle(selectApps);
                setParseAppSelectModalVisible(false);
            }}
            closeHandle={() => {
                setParseAppList([]);
                setParseAppSelectModalVisible(false);
            }}
            title={`${parseText ?? '解析'}App`}>
            <fieldset>
                <legend>提示</legend>
                <ul>
                    <li>不勾选App默认拉取所有应用</li>
                </ul>
            </fieldset>
        </AppSelectModal>

        {/* 云取证App选择框 */}
        <AppSelectModal
            visible={tokenAppSelectModalVisible}
            treeId="tokenAppTree"
            treeData={tokenAppData.fetch}
            selectedKeys={tokenAppList.map((i) => i.m_strID)}
            okHandle={(data) => {
                const selectApps = filterToParseApp(data);
                setTokenAppList(selectApps);
                setTokenAppSelectModalVisible(false);
            }}
            closeHandle={() => {
                setTokenAppList([]);
                setTokenAppSelectModalVisible(false);
            }}
            title={`Token云${fetchText ?? '取证'}App`}>
            <fieldset>
                <legend>Token云取App（目前只支持 Android 设备）</legend>
                <ul>
                    <li>{`Token云${fetchText ?? '取证'}App必须包含在${parseText ?? '解析'}App列表中`}</li>
                    <li>
                        微信——先要先在手机端打开微信, 并且进入账单（此过程手机会联网）,
                        在手机上看到账单正常加载之后, 再进行操作
                    </li>
                    <li>{`其他App没有特殊说明的按正常${fetchText ?? '取证'}流程, ${fetchText ?? '取证'}后会自动进行云取`}</li>
                </ul>
            </fieldset>
        </AppSelectModal>
    </FormBox>;
}

export default AddForm;
