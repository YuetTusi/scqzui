import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import CloudSyncOutlined from '@ant-design/icons/CloudSyncOutlined';
import FileSyncOutlined from '@ant-design/icons/FileSyncOutlined';
import AutoComplete from 'antd/lib/auto-complete';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Empty from 'antd/lib/empty';
import Button from 'antd/lib/button';
import Form, { RuleObject } from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Checkbox from 'antd/lib/checkbox';
import Tooltip from 'antd/lib/tooltip';
import { useOfficerList } from '@/hook';
import { helper } from '@/utils/helper';
import { AllowCaseName } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { caseType } from '@/schema/case-type';
import Auth from '@/component/auth';
import { Split } from '@/component/style-tool';
import { AppSelectModal } from '@/component/dialog';
import parseApp from '@/config/parse-app.yaml';
import tokenApp from '@/config/token-app.yaml';
import { FormBox } from './styled/styled';
import AiSwitch from '../ai-switch';
import { filterToParseApp } from '../helper';
import { FormProp } from './prop';

const { useBcp, useAi, caseText, parseText, fetchText } = helper.readConf()!;

const { Group } = Button;
const { Item } = Form;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};

const EditForm: FC<FormProp> = ({
    formRef, sdCardState, hasReportState, autoParseState, generateBcpState,
    attachmentState, isDelState, isAiState, parseAppListState, tokenAppListState
}) => {

    const unitNameHistory = useRef<string[]>([]);
    const [parseAppSelectModalVisible, setParseAppSelectModalVisible] =
        useState<boolean>(false); //解析App选择框
    const [tokenAppSelectModalVisible, setTokenAppSelectModalVisible] =
        useState<boolean>(false); //云取证App选择框
    const [sdCard, setSdCard] = sdCardState;
    const [hasReport, setHasReport] = hasReportState;
    const [autoParse, setAutoParse] = autoParseState;
    const [generateBcp, setGenerateBcp] = generateBcpState;
    const [attachment, setAttachment] = attachmentState;
    const [isDel, setIsDel] = isDelState;
    const [isAi, setIsAi] = isAiState;
    const [parseAppList, setParseAppList] = parseAppListState;
    const [tokenAppList, setTokenAppList] = tokenAppListState;
    const officer = useOfficerList();

    useEffect(() => {
        unitNameHistory.current = UserHistory.get(HistoryKeys.HISTORY_UNITNAME)
    }, []);

    const ruleToValid = async (rule: RuleObject, value: any) => {
        const from = formRef.getFieldValue('ruleFrom');
        if (from >= value) {
            throw new Error('请大于起始时段');
        }
    };

    return <FormBox>
        <Form form={formRef} {...formItemLayout}>
            <Row>
                <Col span={24}>
                    <Item
                        rules={[{ required: true, message: `请填写${caseText ?? '案件'}名称` }]}
                        name="m_strCaseName"
                        label={`${caseText ?? '案件'}名称`}
                        tooltip={`不可修改，请使用「备用${caseText ?? '案件'}名称」代替原${caseText ?? '案件'}名称`}>
                        <Input
                            maxLength={30}
                            disabled={true}
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item
                        rules={[{ pattern: AllowCaseName, message: '不允许输入非法字符' }]}
                        name="spareName"
                        label={`备用${caseText ?? '案件'}名称`}>
                        <Input
                            placeholder={`备用${caseText ?? '案件'}名称将代替原${caseText ?? '案件'}名称`}
                            maxLength={30}
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item
                        rules={[
                            {
                                required: true,
                                message: '请选择存储位置'
                            }
                        ]}
                        name="m_strCasePath"
                        label="存储位置"
                        tooltip="不可修改存储位置">
                        <Input
                            disabled={true}
                            readOnly={true}
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item
                        rules={[
                            { required: true, message: '请填写检验单位' }
                        ]}
                        name="m_strCheckUnitName"
                        label="检验单位">
                        <AutoComplete
                            options={
                                unitNameHistory.current.reduce(
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
                                )
                            }
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
                                style={{ width: 200 }}
                                onClick={() => setParseAppSelectModalVisible(true)}
                            >
                                <FileSyncOutlined />
                                <span>{`解析App（${parseAppList.length}）`}</span>
                            </Button>
                            <Button
                                style={{ width: 200 }}
                                onClick={() => setTokenAppSelectModalVisible(true)}
                            >
                                <CloudSyncOutlined />
                                <span>{`Token云取证App（${tokenAppList.length}）`}</span>
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
                    <Tooltip title={`勾选后, 取证完成将自动${parseText ?? '解析'}应用数据`}>
                        <Checkbox onChange={(event) => {
                            const { checked } = event.target;
                            if (!checked) {
                                setGenerateBcp(false);
                                setAttachment(false);
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
                                const { checked } = event.target;
                                if (!checked) {
                                    setAttachment(false);
                                }
                                setGenerateBcp(event.target.checked);
                            }}
                            checked={generateBcp}
                            disabled={!autoParse}
                        />
                    </Col>
                    <Col span={3}>
                        <span>BCP包含附件：</span>
                        <Checkbox
                            onChange={(event) => setAttachment(event.target.checked)}
                            checked={attachment}
                            disabled={!generateBcp}
                        />
                    </Col>
                </Auth>
                <Col span={3}>
                    <span>删除原数据：</span>
                    <Tooltip title={`${parseText ?? '解析'}结束自动删除原始数据，可节省磁盘空间，不可再次重新${parseText ?? '解析'}`}>
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
                style={{ display: useBcp && generateBcpState[0] ? 'block' : 'none' }}>
                <div className="cate-bar">
                    <FontAwesomeIcon icon={faAnglesDown} />
                    <span>BCP信息</span>
                </div>
                <Row>
                    <Col span={12}>
                        <Item
                            rules={[
                                {
                                    required: generateBcpState[0] ?? false,
                                    message: `请选择${fetchText ?? '取证'}人员`
                                }
                            ]}
                            name="officerNo"
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
            <div
                className="cate"
                style={{ display: useAi && isAiState[0] ? 'block' : 'none' }}>
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
            treeData={parseApp.fetch}
            selectedKeys={parseAppList.map((i) => i.m_strID)}
            okHandle={(data) => {
                const selectApps = filterToParseApp(data);
                setParseAppList(selectApps);
                // context.parseAppSelectHandle(selectApps);
                setParseAppSelectModalVisible(false);
            }}
            closeHandle={() => {
                setParseAppList(parseAppListState[0] ?? []);
                setParseAppSelectModalVisible(false);
            }}
            treeId="parseTree"
            title={`${parseText ?? '解析'}App`}>
            <fieldset>
                <legend>{`${parseText ?? '解析'}App`}</legend>
                <ul>
                    <li>不勾选App默认拉取所有应用</li>
                </ul>
            </fieldset>
        </AppSelectModal>
        {/* 云取证App选择框 */}
        <AppSelectModal
            visible={tokenAppSelectModalVisible}
            treeData={tokenApp.fetch}
            selectedKeys={tokenAppList.map((i) => i.m_strID)}
            okHandle={(data) => {
                const selectApps = filterToParseApp(data);
                setTokenAppList(selectApps);
                // context.tokenAppSelectHandle(selectApps);
                setTokenAppSelectModalVisible(false);
            }}
            closeHandle={() => {
                setTokenAppList(tokenAppListState[0] ?? []);
                setTokenAppSelectModalVisible(false);
            }}
            treeId="tokenTree"
            title="Token云取证App">
            <fieldset>
                <legend>Token云取App（目前只支持 Android 设备）</legend>
                <ul>
                    <li>{`Token云取证App必须包含在${parseText ?? '解析'}App列表中`}</li>
                    <li>
                        微信——先要先在手机端打开微信, 并且进入账单（此过程手机会联网）,
                        在手机上看到账单正常加载之后, 再进行取证
                    </li>
                    <li>其他App没有特殊说明的按正常取证流程, 取证后会自动进行云取</li>
                </ul>
            </fieldset>
        </AppSelectModal>
    </FormBox>
}

export default EditForm;