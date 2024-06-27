import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';
import LeftCircleOutlined from '@ant-design/icons/LeftCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { Button, Form, Modal } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { CaseTree } from './case-tree';
import { StepForm } from './step-form';
import { StepOneFormValue, StepTwoFormValue, StepThreeFormValue, StepFourFormValue } from './step-form/prop';
import { PaperworkModalBox } from './styled/box';
import { PaperworkModalProp } from './prop';

const { Item, useForm } = Form;

/**
 * 文书生成框
 */
const PaperworkModal: FC<PaperworkModalProp> = ({ open, onCancel, onOk }) => {

    const dispatch = useDispatch();
    const [, contextHolder] = Modal.useModal();
    const oneFormValue = useRef<StepOneFormValue>();
    const [oneFormRef] = useForm<StepOneFormValue>();
    const [twoFormRef] = useForm<StepTwoFormValue>();
    const [threeFormRef] = useForm<StepThreeFormValue>();
    const [fourFormRef] = useForm<StepFourFormValue>();
    const {
        caseTree,
        expandedKeys
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);
    const [step, setStep] = useState(3);

    useEffect(() => {
        if (open) {
            dispatch({ type: 'paperworkModal/queryCaseTree' });
        }
    }, [open]);

    /**
     * 上一步Click
     * @param event 
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
        try {
            switch (step) {
                case 0:
                    const values = await oneFormRef.validateFields();
                    oneFormValue.current = values;
                    setStep(1);
                    break;
                case 1:
                    setStep(2);
                    break;
                case 2:
                    setStep(3);
                    break;
            }
        } catch (error) {
            console.error(error);
        }
        onOk();
    };

    /**
     * 取消Click
     * @param event 
     */
    const onCancelClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        dispatch({ type: 'paperworkModal/clearCheckedDevices' });
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
        onCancel={onCancel}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        width={1220}
        title="生成鉴定报告"
        getContainer="#app"
        className="zero-padding-body">
        {contextHolder}
        <PaperworkModalBox>
            <div className="tree-box">
                <div className="full-box">
                    <CaseTree
                        data={caseTree}
                        expandedKeys={expandedKeys}
                        onExpand={(keys) => dispatch({ type: 'paperworkModal/setExpandedKeys', payload: keys })}
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