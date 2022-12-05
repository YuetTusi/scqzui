import dayjs from 'dayjs';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { ipcRenderer, IpcRendererEvent, OpenDialogReturnValue } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Empty from 'antd/lib/empty';
import DatePicker from 'antd/lib/date-picker';
import Input from 'antd/lib/input'
import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import { useSubscribe, useOfficerList } from '@/hook';
import { helper } from '@/utils/helper';
import { No } from '@/utils/regex';
import { certificateType } from '@/schema/certificate-type';
import { ethnicity } from '@/schema/ethnicity';
import { sexCode } from '@/schema/sex-code';
import { Split } from '@/component/style-tool';
import { GenerateFormBox } from './styled/style';
import { GenerateFormProp } from './prop';

const { fetchText } = helper.readConf()!;
const { Item } = Form;
const { Group } = Radio;
const { Option } = Select;
const Datepicker = DatePicker as any;

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
};

/**
 * 取BCP号前3位
 * @param code 单位编号
 */
const getBcpNo1 = (code?: string) => {
    if (code) {
        let unitNo = code.substring(0, 6); //取采集单位的前6位
        let timestamp = dayjs().format('YYYYMM');
        return unitNo + timestamp;
    } else {
        return '';
    }
};

/**
 * 按关键字查询单位
 * @param {string} keyword 关键字
 */
const queryOrgByKeyword = throttle(async (keyword: string) =>
    ipcRenderer.send('query-db', keyword, 1),
    500);

/**
 * 选择头像
 */
const selectDirHandle = debounce(
    (setFieldsValue: (obj: Object, callback?: Function | undefined) => void) => {
        ipcRenderer
            .invoke('open-dialog', {
                properties: ['openFile'],
                filters: [{ name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
            })
            .then((val: OpenDialogReturnValue) => {
                if (val.filePaths && val.filePaths.length > 0) {
                    setFieldsValue({ credentialAvatar: val.filePaths[0] });
                }
            });
    },
    600,
    { leading: true, trailing: false }
);

/**
 * 生成BCP表单
 */
const GenerateForm: FC<GenerateFormProp> = ({
    formRef, history, caseData, deviceData, unit, dstUnit,
    unitChangeHandle, dstUnitChangeHandle
}) => {

    const { setFieldsValue } = formRef;
    const [unitData, setUnitData] = useState<any[]>([]);
    const [dstUnitData, setDstUnitData] = useState<any[]>([]);
    const [bcpRequired, setBcpRequired] = useState<boolean>(false);
    const officerList = useOfficerList();

    const queryUnitHandle = (event: IpcRendererEvent, result: Record<string, any>) => {
        const { data } = result;
        if (data.rows && data.rows.length > 0) {
            setUnitData(data.rows);
            setDstUnitData(data.rows);
        }
    };

    useSubscribe('query-db-result', queryUnitHandle);

    useEffect(() => {

        if (caseData !== null && deviceData !== null) {
            setFieldsValue({
                attachment: caseData?.attachment ?? false,
                unitCode: unit[0] ?? '',
                dstUnitCode: dstUnit[0] ?? '',
                officerNo: caseData?.officerNo ?? '',
                mobileHolder: deviceData?.mobileHolder ?? '',
                bcpNo1: getBcpNo1(unit[0]),
                phoneNumber: history?.phoneNumber ?? '',
                handleOfficerNo: history?.handleOfficerNo ?? deviceData?.handleOfficerNo,
                credentialType: history?.credentialType ?? '',
                credentialNo: history?.credentialNo ?? '',
                credentialEffectiveDate: helper.isNullOrUndefinedOrEmptyString(history?.credentialEffectiveDate)
                    ? '' : dayjs(history!.credentialEffectiveDate),
                credentialExpireDate: helper.isNullOrUndefinedOrEmptyString(history?.credentialExpireDate)
                    ? '' : dayjs(history!.credentialExpireDate),
                credentialOrg: history?.credentialOrg ?? '',
                credentialAvatar: history?.credentialAvatar ?? '',
                gender: history?.gender ?? '1',
                nation: history?.nation ?? '01',
                birthday: helper.isNullOrUndefinedOrEmptyString(history?.birthday)
                    ? '' : dayjs(history!.birthday),
                address: history?.address ?? '',
                securityCaseNo: history?.securityCaseNo ?? '',
                securityCaseType: history?.securityCaseType ?? '',
                securityCaseName: history?.securityCaseName ?? '',
                handleCaseNo: history?.handleCaseNo ?? '',
                handleCaseType: history?.handleCaseType ?? '',
                handleCaseName: history?.handleCaseName ?? ''
            });
        }
    }, [caseData, deviceData, unit, dstUnit]);

    /**
     * 绑定采集单位Options
     */
    const bindUnitOptions = () => {
        const [unitCode, unitName] = unit;
        let options = unitData.map(
            (item) => <Option
                value={item.PcsCode}
                data-name={item.PcsName}
                key={`U_${item.PcsID}`}>
                {item.PcsName}
            </Option>
        );
        if (unitCode) {
            options = options.concat(
                <Option
                    value={unitCode}
                    data-name={unitName}
                    key={`U_${unitCode}`}>
                    {unitName}
                </Option>
            );
        }
        return options;
    };

    /**
     * 绑定目的检验单位Options
     */
    const bindDstUnitOptions = () => {
        const [code, name] = dstUnit;
        let options = dstUnitData.map(
            (item) => <Option
                value={item.PcsCode}
                data-name={item.PcsName}
                key={`DU_${item.PcsID}`}>
                {item.PcsName}
            </Option>
        );
        if (code && name) {
            options = options.concat(
                <Option
                    value={code}
                    data-name={name}
                    key={`DU_${code}`}>
                    {name}
                </Option>
            );
        }
        return options;
    };

    /**
     * 采集单位Change
     */
    const onUnitChange = (value: string, options: any) => {
        const bcpNo1 = getBcpNo1(value);
        setFieldsValue({ bcpNo1 });
        unitChangeHandle(value, options['data-name']);
    };

    /**
     * 目的检验单位Change
     */
    const onDstUnitChange = (value: string, options: any) =>
        dstUnitChangeHandle(value, options['data-name']);

    return <GenerateFormBox>
        <Form form={formRef} {...formItemLayout}>
            <Row>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: true,
                                message: '请确定有无附件'
                            }
                        ]}
                        initialValue={false}
                        name="attachment"
                        label="BCP附件">
                        <Group>
                            <Radio value={false}>无附件</Radio>
                            <Radio value={true}>有附件</Radio>
                        </Group>
                    </Item>
                </Col>
                <Col span={12} />
            </Row>
            <Split />
            <div className="blank" />
            <Row>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: true,
                                message: `请选择${fetchText ?? '取证'}单位`
                            }
                        ]}
                        name="unitCode"
                        label={`${fetchText ?? '取证'}单位`}>
                        <Select
                            showSearch={true}
                            placeholder={'输入单位名称进行查询'}
                            defaultActiveFirstOption={false}
                            notFoundContent={
                                <Empty
                                    description="暂无数据"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            }
                            showArrow={false}
                            filterOption={false}
                            onSearch={queryOrgByKeyword}
                            onChange={onUnitChange}
                            style={{ width: '100%' }}>
                            {bindUnitOptions()}
                        </Select>
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: true,
                                message: '请选择目的检验单位'
                            }
                        ]}
                        name="dstUnitCode"
                        label="目的检验单位">
                        <Select
                            showSearch={true}
                            placeholder={'输入单位名称进行查询'}
                            defaultActiveFirstOption={false}
                            notFoundContent={
                                <Empty
                                    description="暂无数据"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            }
                            showArrow={false}
                            filterOption={false}
                            onSearch={queryOrgByKeyword}
                            onChange={onDstUnitChange}
                            style={{ width: '100%' }}>
                            {bindDstUnitOptions()}
                        </Select>
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: true,
                                message: `请选择${fetchText ?? '取证'}人员`
                            }
                        ]}
                        name="officerNo"
                        label={`${fetchText ?? '取证'}人员`}>
                        <Select
                            notFoundContent="暂无数据">
                            {helper.arrayToOptions(officerList, 'name', 'no')}
                        </Select>
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        rules={
                            [
                                {
                                    required: true,
                                    message: '请填写持有人'
                                }
                            ]
                        }
                        name="mobileHolder"
                        label="持有人">
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="bcpNo1"
                        label="检材编号"
                        tooltip={<>
                            <div>单位编号前6位+日期年月</div>
                            <div>格式举例：110000202301</div>
                        </>}>
                        <Input maxLength={12} placeholder="12位数字" />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item label="校验检材编号">
                        <Switch
                            checked={bcpRequired}
                            onChange={(checked: boolean) => {
                                setBcpRequired(checked);
                            }}
                            size="small"
                        />
                        <em className={classnames({ active: bcpRequired })}>
                            开启将强制输入检材编号且验证格式
                        </em>
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: bcpRequired,
                                message: '请填写检材编号'
                            },
                            {
                                pattern: No,
                                message: '请输入数字'
                            }
                        ]}
                        name="bcpNo2"
                        label="检材编号(前3位)">
                        <Input maxLength={3} placeholder="3位数字" />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        rules={[
                            {
                                required: bcpRequired,
                                message: '请填写检材编号'
                            },
                            {
                                pattern: No,
                                message: '请输入数字'
                            }
                        ]}
                        name="bcpNo3"
                        label="检材编号(后4位)">
                        <Input maxLength={4} placeholder="4位数字" />
                    </Item>
                </Col>
            </Row>
            <Split />
            <div className="blank"></div>
            <Row>
                <Col span={12}>
                    <Item
                        name="phoneNumber"
                        label="手机号">
                        <Input />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="handleOfficerNo"
                        label="检材持有人编号">
                        <Input placeholder="检材持有人编号/执法办案人员编号" />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="credentialType"
                        label="证件类型">
                        <Select notFoundContent="暂无数据">
                            {helper.arrayToOptions(certificateType)}
                        </Select>
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="credentialNo"
                        label="证件编号">
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="credentialEffectiveDate"
                        label="证件生效日期">
                        <Datepicker style={{ width: '100%' }} />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="credentialExpireDate"
                        label="证件失效日期">
                        <Datepicker style={{ width: '100%' }} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="credentialOrg"
                        label="证件签发机关">
                        <Input />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="credentialAvatar"
                        label="证件认证头像">
                        <Input
                            readOnly={true}
                            placeholder="请选择头像文件"
                            onClick={() => selectDirHandle(setFieldsValue)}
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="gender"
                        label="性别">
                        <Select>{helper.arrayToOptions(sexCode)}</Select>
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="nation"
                        label="民族">
                        <Select>{helper.arrayToOptions(ethnicity)}</Select>
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="birthday"
                        label="出生日期">
                        <Datepicker
                            disabledDate={(current: any) => {
                                if (current) {
                                    return current > dayjs().endOf('day');
                                } else {
                                    return false;
                                }
                            }}
                            defaultPickerValue={dayjs().add(-10, 'year')}
                            style={{ width: '100%' }}
                        />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="address"
                        label="住址">
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Split />
            <div className="blank"></div>
            <Row>
                <Col span={24}>
                    <Item
                        name="securityCaseName"
                        label="网安部门案件名称"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 19 }}>
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        name="handleCaseNo"
                        label="执法办案系统案件编号">
                        <Input />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        name="handleCaseType"
                        label="执法办案系统案件类别">
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
                        wrapperCol={{ span: 19 }}>
                        <Input />
                    </Item>
                </Col>
            </Row>
        </Form>
    </GenerateFormBox>
};

export { GenerateForm };