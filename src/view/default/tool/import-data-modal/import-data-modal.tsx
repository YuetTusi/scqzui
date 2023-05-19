import { join } from 'path';
import React, { FC, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { useAppConfig } from '@/hook';
import { StateTree } from '@/type/model';
import { ImportTypes } from '@/schema/import-type';
import { ImportDataModalState } from '@/model/default/import-data-modal';
import { ImportForm } from './import-form';
import { FormValue, ImportModalProp } from './prop';
import { ImportDataModalBox } from './styled/box';

const { useForm } = Form;

/**
 * 导入
 */
const ImportDataModal: FC<ImportModalProp> = ({ }) => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const appConfig = useAppConfig();
    const {
        visible,
        title,
        importType,
        tips
    } = useSelector<StateTree, ImportDataModalState>(state => state.importDataModal);

    /**
     * 取消Click
     */
    const onCancelClick = (_: MouseEvent<HTMLElement>) => {
        const { resetFields } = formRef;
        resetFields();
        dispatch({ type: 'importDataModal/setTips', payload: [] });
        dispatch({ type: 'importDataModal/setVisible', payload: false });
    };

    /**
     * 渲染提示信息（如果有）
     */
    const renderTips = () => {
        if (tips && tips.length > 0) {
            return <fieldset className="tip-msg full">
                <legend>
                    操作提示
                </legend>
                <div>
                    <ul>
                        {tips.map((item, index) => <li key={`IDMT_${index}`}>{item}</li>)}
                    </ul>
                </div>
            </fieldset>
        } else {
            return null;
        }
    };

    /**
     * 确定Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            let values = await validateFields();

            if (importType === ImportTypes.Samsung_Smartswitch) {
                //# 因为三星换机让用户选择backupHistoryInfo.xml文件，因此要回退一级只传目录
                values = {
                    ...values,
                    packagePath: join(values.packagePath, '../')
                }
            }

            dispatch({
                type: 'importDataModal/saveImportDeviceToCase', payload: {
                    formValue: values,
                    importType,
                    useDefaultTemp: appConfig?.useKeyword ?? true,
                    useKeyword: appConfig?.useKeyword ?? false,
                    useDocVerify: appConfig?.useDocVerify ?? false,
                    usePdfOcr: appConfig?.usePdfOcr ?? false
                }
            });
        } catch (error) {
            console.warn(error);
        }
    };

    return <Modal
        footer={[
            <Button onClick={onCancelClick} type="default" key="IM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={onSaveClick} type="primary" key="IM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={(e: MouseEvent<HTMLElement>) => onCancelClick(e)}
        title={title}
        width={820}
        visible={visible}
        centered={true}
        destroyOnClose={true}
        forceRender={true}
        maskClosable={false}>
        <ImportDataModalBox>
            {renderTips()}
            <ImportForm
                formRef={formRef}
                type={importType} />
        </ImportDataModalBox>
    </Modal>
};

export default ImportDataModal;