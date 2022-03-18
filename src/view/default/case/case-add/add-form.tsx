import throttle from 'lodash/throttle';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useState, useCallback } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import FileSyncOutlined from '@ant-design/icons/FileSyncOutlined'
import CloudSyncOutlined from '@ant-design/icons/CloudSyncOutlined'
import SelectOutlined from '@ant-design/icons/SelectOutlined'
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';
import Checkbox from 'antd/lib/checkbox';
import Form from 'antd/lib/form';
import Empty from 'antd/lib/empty';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Tooltip from 'antd/lib/tooltip';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { helper } from '@/utils/helper';
import { AllowCaseName } from '@/utils/regex';
import UserHistory, { HistoryKeys } from '@/utils/user-history';
import { caseType } from '@/schema/case-type';
import { useOfficerList } from '@/hook/officer-list';
import parseAppData from '@/config/parse-app.yaml';
import tokenAppData from '@/config/token-app.yaml';
import { Split } from '@/component/style-tool';
import { AppSelectModal } from '@/component/dialog';
import { filterToParseApp } from '../helper';
import { FormBox } from './styled/styled';
import { FormProp } from './prop';


const { Group } = Button;
const { Search } = Input;
const { Item } = Form;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};
const { useBcp, useAi } = helper.readConf()!;


const AddForm: FC<FormProp> = ({
    formRef, sdCardState, hasReportState, autoParseState, generateBcpState,
    attachmentState, isDelState, isAiState, parseAppListState, tokenAppListState
}) => {
    const [isCheck, setIsCheck] = useState(false);
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
    const historyUnitNames = UserHistory.get(HistoryKeys.HISTORY_UNITNAME)
    const officer = useOfficerList();

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
                throw new Error('案件名称已存在');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsCheck(false);
        }
    }, 400);

    return (
        <FormBox>
            <Form form={formRef} {...formItemLayout}>
                <Row>
                    <Col span={24}>
                        <Item rules={[
                            { required: true, message: '请填写案件名称' },
                            { pattern: AllowCaseName, message: '不允许输入非法字符' },
                            {
                                validator: validCaseNameExists,
                                message: '案件名称已存在'
                            }
                        ]}
                            name="currentCaseName"
                            label="案件名称">
                            <Search maxLength={30} loading={isCheck} />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Item rules={[
                            {
                                required: true,
                                message: '请选择存储路径'
                            }
                        ]}
                            name="m_strCasePath"
                            label="存储路径">
                            <Input
                                suffix={<SelectOutlined onClick={selectDirHandle} />}
                                readOnly={true}
                                placeholder="请选择存储路径"
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
                        <Item label="选择App">
                            <Group>
                                <Button
                                    onClick={() => setParseAppSelectModalVisible(true)}
                                    style={{ width: 200 }}>
                                    <FileSyncOutlined />
                                    <span>{`解析App（${parseAppList.length}）`}</span>
                                </Button>
                                <Button
                                    onClick={() => setTokenAppSelectModalVisible(true)}
                                    style={{ width: 200 }}>
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
                        <span>自动解析：</span>
                        <Tooltip title="勾选后, 取证完成将自动解析应用数据">
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
                    <Col span={3}>
                        <span>删除原数据：</span>
                        <Tooltip title="解析结束自动删除原始数据，可节省磁盘空间，不可再次执行解析操作">
                            <Checkbox onChange={(event) => setIsDel(event.target.checked)} checked={isDel} />
                        </Tooltip>
                    </Col>
                    <Col span={3}>
                        <span>AI分析：</span>
                        <Checkbox onChange={(event) => setIsAi(event.target.checked)} checked={isAi} />
                    </Col>
                </Row>
                <div
                    className="cate"
                    style={{ display: useBcp && generateBcp ? 'block' : 'none' }}>
                    <div className="cate-bar">
                        <AppstoreOutlined rotate={45} />
                        <span>BCP信息</span>
                    </div>
                    <Row>
                        <Col span={12}>
                            <Item
                                rules={[
                                    {
                                        required: generateBcp,
                                        message: '请选择采集人员'
                                    }
                                ]}
                                name="officerNo"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                                label="采集人员">
                                <Select
                                    onChange={() => { }}
                                    notFoundContent={
                                        <Empty
                                            description="暂无采集人员"
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
                        <AppstoreOutlined rotate={45} />
                        <span>AI信息</span>
                    </div>
                    <Row>
                        <Col span={2} />
                        <Col span={3}>
                            <Tooltip title="缩略图是指聊天应用接收到，未点击查看的图片，该类型图片识别度较低，数量较多">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiThumbnail"
                                    label="分析缩略图"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="刀具，大炮，坦克，枪械，军舰，子弹">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiWeapon"
                                    label="武器类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="文件，红头文件，盖章文件，二维码">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiDoc"
                                    label="文档类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Item
                                initialValue={true}
                                valuePropName="checked"
                                name="aiDrug"
                                label="毒品类"
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 4 }}>
                                <Switch size="small" />
                            </Item>
                        </Col>
                        <Col span={3}>
                            <Item
                                initialValue={true}
                                valuePropName="checked"
                                name="aiNude"
                                label="裸体类"
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 4 }}>
                                <Switch size="small" />
                            </Item>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="货币">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiMoney"
                                    label="货币类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="军装">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiDress"
                                    label="着装类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} />
                        <Col span={3}>
                            <Tooltip title="汽车，飞机">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiTransport"
                                    label="交通工具"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="银行卡，证件，证书执照">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiCredential"
                                    label="证件类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="交易记录，聊天记录，转账红包">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiTransfer"
                                    label="聊天转帐类"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Tooltip title="截图，人像，照片">
                                <Item
                                    initialValue={true}
                                    valuePropName="checked"
                                    name="aiScreenshot"
                                    label="照片截图"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 4 }}>
                                    <Switch size="small" />
                                </Item>
                            </Tooltip>
                        </Col>
                        <Col span={10} />
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
                title="解析App">
                <fieldset>
                    <legend>解析App</legend>
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
                title="Token云取证App">
                <fieldset>
                    <legend>Token云取App（目前只支持 Android 设备）</legend>
                    <ul>
                        <li>Token云取证App必须包含在解析App列表中</li>
                        <li>
                            微信——先要先在手机端打开微信, 并且进入账单（此过程手机会联网）,
                            在手机上看到账单正常加载之后, 再进行取证
                        </li>
                        <li>其他App没有特殊说明的按正常取证流程, 取证后会自动进行云取</li>
                    </ul>
                </fieldset>
            </AppSelectModal>
        </FormBox>
    );
}

export default AddForm;
