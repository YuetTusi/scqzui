import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import { FileFilter, ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import { useCaseList } from '@/hook';
import { IMEI } from '@/utils/regex';
import { helper } from '@/utils/helper';
import { ImportTypes } from '@/schema/import-type';
import { ImportFormProp } from './prop';

const { caseText, devText } = helper.readConf()!;
const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 }
};

const NoteBox = styled.div`
    color:${(props) => props.theme['error-color']};
    height: 30px;
    line-height: 30px;
    font-size: 1.2rem;
`;

/**
 * 表单
 */
const ImportForm: FC<ImportFormProp> = ({
    formRef,
    type
}) => {
    const { setFieldsValue, resetFields } = formRef;
    const caseList = useCaseList();

    const bindCaseOptions = () => caseList.map(({ _id, m_strCaseName }) => {
        const [name, timespan] = m_strCaseName.split('_');
        return <Option value={_id} key={`C_${_id}`}>
            {`${name}（${dayjs(timespan).format('YYYY-MM-MM HH:mm:ss')}）`}
        </Option>;
    });

    /**
     * 根据导入类型返回文件过滤类型
     * @param type 导入类型
     */
    const getFilters = (type: ImportTypes) => {
        let filter: FileFilter[] | undefined;

        switch (type) {
            case ImportTypes.IOSMirror:
                filter = [{ name: 'iOS镜像', extensions: ['tar', 'zip'] }];
                break;
            case ImportTypes.Samsung_Smartswitch:
                filter = [{ name: 'XML文件', extensions: ['xml'] }];
                break;
            default:
                filter = undefined;
                break;
        }
        return filter;
    };

    /**
     * 根据导入类型返回选择目录还是文件
     * @param type 导入类型
     */
    const getProperties = (type: ImportTypes) => {
        let properties: Array<'openFile' | 'openDirectory'> = [];
        switch (type) {
            case ImportTypes.IOSMirror:
            case ImportTypes.Samsung_Smartswitch:
            case ImportTypes.AndroidMirror:
                properties = ['openFile'];
                break;
            default:
                properties = ['openDirectory'];
                break;
        }
        return properties;
    };

    /**
    * SD卡数据选择框handle
    */
    const selectSdCardDirHandle = debounce(
        (field: string) => {
            ipcRenderer
                .invoke('open-dialog', { properties: ['openDirectory', 'createDirectory'] })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths && val.filePaths.length > 0) {
                        setFieldsValue({ [field]: val.filePaths[0] });
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    /**
     * 按输入项过滤Option
     * @param inputValue 输入值
     * @param option Option项
     * @returns 输入项关键字存在为true
     */
    const onFilterOption = (inputValue: string, option: any) => {
        const { children } = option.props;
        return (children as string).includes(inputValue);
    };

    /**
    * 目录&文件选择框handle
    */
    const selectPackageDirHandle = debounce(
        (field: string) => {
            ipcRenderer
                .invoke('open-dialog', {
                    properties: getProperties(type),
                    filters: getFilters(type)
                })
                .then((val: OpenDialogReturnValue) => {
                    resetFields([field]);
                    if (val.filePaths && val.filePaths.length > 0) {
                        setFieldsValue({ [field]: val.filePaths[0] });
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    return <Form
        form={formRef}
        layout="horizontal"
        style={{ paddingTop: '20px' }}
        {...formItemLayout}>
        <Row>
            <Col span={24}>
                <Item
                    rules={[
                        {
                            required: true,
                            message: `请选择${caseText ?? '案件'}`
                        }
                    ]}
                    name="caseId"
                    label={`${caseText ?? '案件'}名称`}>
                    <Select
                        filterOption={onFilterOption}
                        showSearch={true}
                        notFoundContent="暂无数据"
                        placeholder={`选择${caseText ?? '案件'}，可输入名称筛选`}>
                        {bindCaseOptions()}
                    </Select>
                </Item>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Item
                    rules={[{ required: true, message: '请选择第三方数据位置' }]}
                    name="packagePath"
                    label="数据位置">
                    <Input
                        readOnly={true}
                        placeholder="第三方数据所在位置"
                        onClick={() => selectPackageDirHandle('packagePath')}
                    />
                </Item>
            </Col>
        </Row>
        <Row style={{ display: type === ImportTypes.AndroidData ? 'block' : 'none' }}>
            <Col span={24}>
                <Item
                    name="sdCardPath"
                    label="SD卡数据位置">
                    <Input
                        readOnly={true}
                        placeholder="SD卡数据位置"
                        onClick={() => selectSdCardDirHandle('sdCardPath')}
                    />
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
                        }
                    ]}
                    name="mobileName"
                    label={`${devText ?? '设备'}名称`}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}>
                    <Input maxLength={20} />
                </Item>
            </Col>
            <Col span={12}>
                <Item
                    rules={[
                        {
                            required: true,
                            message: '请填写持有人'
                        }
                    ]}
                    name="mobileHolder"
                    label="持有人"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}>
                    <Input placeholder="持有人姓名" maxLength={20} />
                </Item>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Item
                    rules={[
                        {
                            required: true,
                            message: '请填写备注'
                        }
                    ]}
                    initialValue=""
                    name="note"
                    label="备注">
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
                            message: '请填写IMEI'
                        },
                        {
                            pattern: IMEI,
                            message: '15位数字'
                        }
                    ]}
                    name="mobileNo"
                    label="IMEI"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}>
                    <Input maxLength={15} placeholder="15位数字" />
                </Item>
            </Col>
            <Col span={12}>
                <NoteBox>
                    不填写IMEI会影响生成BCP文件
                </NoteBox>
            </Col>
        </Row>
    </Form>
};

export { ImportForm };