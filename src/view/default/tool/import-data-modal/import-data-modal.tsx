
import React, { FC, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { useAppConfig } from '@/hook';
import { StateTree } from '@/type/model';
import { ImportDataModalState } from '@/model/default/import-data-modal';
import { ImportForm } from './import-form';
import { FormValue, ImportModalProp } from './prop';

const { useForm } = Form;

/**
 * 导入
 */
const ImportDataModal: FC<ImportModalProp> = () => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const appConfig = useAppConfig();
    const {
        visible,
        title,
        importType
    } = useSelector<StateTree, ImportDataModalState>(state => state.importDataModal);

    /**
     * 取消Click
     */
    const onCancelClick = (event: MouseEvent<HTMLElement>) => {
        const { resetFields } = formRef;
        resetFields();
        dispatch({ type: 'importDataModal/setVisible', payload: false });
    };

    /**
     * 确定Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            const values = await validateFields();

            dispatch({
                type: 'importDataModal/saveImportDeviceToCase', payload: {
                    formValue: values,
                    importType,
                    useKeyword: appConfig?.useKeyword ?? false,
                    useDocVerify: appConfig?.useDocVerify ?? false
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
        <ImportForm
            formRef={formRef}
            type={importType} />
    </Modal>
}

export default ImportDataModal;