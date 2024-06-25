import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import RightCircleOutlined from '@ant-design/icons/RightCircleOutlined';
import LeftCircleOutlined from '@ant-design/icons/LeftCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import { Button, Form, Modal } from 'antd';
import { PaperworkModalProp } from './prop';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { CaseTree } from './case-tree';
import { StepForm } from './step-form';
import { PaperworkModalBox } from './styled/box';
import { StepOneFormValue, StepTwoFormValue } from './step-form/prop';

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
    const {
        caseTree,
        expandedKeys
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);
    const [step, setStep] = useState(1);

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
                    setStep(prev => prev + 1);
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
        dispatch({ type: 'paperworkModal/clearCheckedHolders' });
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
                disabled={step >= 5}
                type="primary"
                key="PWM_2">
                <RightCircleOutlined />
                <span>下一步</span>
            </Button>,
        ]}
        open={open}
        onCancel={onCancel}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        width={1140}
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
                    twoFormRef={twoFormRef} />
            </div>
        </PaperworkModalBox>
    </Modal>
};

export { PaperworkModal };