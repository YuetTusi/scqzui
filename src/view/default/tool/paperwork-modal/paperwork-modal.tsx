import { join } from 'path';
import { mapValues } from 'lodash';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';
import LeftCircleOutlined from '@ant-design/icons/LeftCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { Button, Form, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { helper } from '@/utils/helper';
import { CaseTree } from './case-tree';
import { StepForm } from './step-form';
import {
    StepOneFormValue,
    StepTwoFormValue,
    StepThreeFormValue,
    StepFourFormValue
} from './step-form/prop';
import { PaperworkModalBox } from './styled/box';
import { PaperworkModalProp } from './prop';

const { useForm } = Form;

/**
 * 文书生成框
 */
const PaperworkModal: FC<PaperworkModalProp> = ({ open, onCancel, onOk }) => {

    const dispatch = useDispatch();
    const oneFormValue = useRef<StepOneFormValue>(); //第1步表单值
    const [oneFormRef] = useForm<StepOneFormValue>();
    const [twoFormRef] = useForm<StepTwoFormValue>();
    const [threeFormRef] = useForm<StepThreeFormValue>();
    const [fourFormRef] = useForm<StepFourFormValue>();
    const {
        caseTree,
        loading,
        selectedCaseCount,
        selectedCaseName,
        expandedKeys,
        twoFormValue, //第2步表单值
        threeFormValue, //第3步表单值
        fourFormValue //第4步表单值
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (open) {
            dispatch({ type: 'paperworkModal/queryCaseTree' });
        }
    }, [open]);

    useEffect(() => {
        if (selectedCaseName) {
            oneFormRef.setFieldsValue({ caseName: selectedCaseName });
        }
    }, [selectedCaseName]);

    /**
     * 上一步Click
     */
    const onPrevClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setStep(prev => prev - 1);
    };

    /**
     * 下一步Click
     */
    const onNextClick = async (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (selectedCaseCount > 1) {
            Modal.info({
                title: '提示',
                content: '只可选择一个案件数据',
                centered: true,
                okText: '确定'
            });
            return;
        }
        switch (step) {
            case 0:
                try {
                    const one = await oneFormRef.validateFields();
                    oneFormValue.current = one;
                    setStep(1);
                } catch (error) {
                    console.warn(error);
                }
                break;
            case 1:
                setStep(2);
                break;
            case 2:
                setStep(3);
                break;
            case 3:
                message.destroy();
                try {
                    await helper.writeJSONfile(join(helper.APP_CWD, 'report-doc.json'), mapValues({
                        ...oneFormValue.current,
                        ...twoFormValue,
                        ...fourFormValue,
                        devices: threeFormValue.map(i =>
                            mapValues(i, (value) => value === undefined ? '' : value))
                    }, (value) => value === undefined ? '' : value));
                    await helper.runTask(
                        join(helper.APP_CWD, 'AppraisalReport.exe'),
                        [join(helper.APP_CWD, 'report-doc.json')]
                    );
                    message.success('生成成功');
                    onCancelClick(event);
                } catch (error) {
                    message.error(`生成失败 ${error.message}`);
                }

                break;
        }
        onOk();
    };

    /**
     * 取消Click
     * @param event 
     */
    const onCancelClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        dispatch({ type: 'paperworkModal/resetValue' });
        oneFormRef.resetFields();
        twoFormRef.resetFields();
        threeFormRef.resetFields();
        fourFormRef.resetFields();
        setStep(0);
        onCancel();
    };

    return <Modal
        footer={[
            <Button
                onClick={onCancelClick}
                key="PWM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onPrevClick}
                disabled={step <= 0}
                type="primary"
                key="PWM_1">
                <LeftCircleOutlined />
                <span>上一步</span>
            </Button>,
            <Button
                onClick={onNextClick}
                type="primary"
                key="PWM_2">
                {step < 3 ? <RightCircleOutlined /> : <CheckCircleOutlined />}
                {step < 3 ? <span>下一步</span> : <span>生成</span>}
            </Button>,
        ]}
        open={open}
        onCancel={onCancelClick}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        width={1220}
        title="生成鉴定报告"
        getContainer="#app"
        className="zero-padding-body">
        <PaperworkModalBox>
            <div className="tree-box">
                <div className="full-box">
                    <CaseTree
                        loading={loading}
                        data={caseTree}
                        expandedKeys={expandedKeys}
                        disabled={step !== 0}
                        onExpand={(keys) => {
                            dispatch({ type: 'paperworkModal/setExpandedKeys', payload: keys })
                        }}
                    />
                </div>
            </div>
            <div className="form-box">
                <StepForm
                    step={step}
                    oneFormRef={oneFormRef}
                    twoFormRef={twoFormRef}
                    threeFormRef={threeFormRef}
                    fourFormRef={fourFormRef} />
            </div>
        </PaperworkModalBox>
    </Modal>
};

export { PaperworkModal };