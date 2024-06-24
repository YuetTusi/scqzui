import React, { FC, MouseEvent, useEffect, useState } from 'react';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { Button, Form, Modal } from 'antd';
import { PaperworkModalProp } from './prop';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { CaseTree } from './case-tree';
import { StepForm } from './step-form';
import { PaperworkModalBox } from './styled/box';
import { StepOneFormValue } from './step-form/prop';

const { Item, useForm } = Form;

/**
 * 文书生成框
 */
const PaperworkModal: FC<PaperworkModalProp> = ({ open, onCancel, onOk }) => {

    const dispatch = useDispatch();
    const [oneFormRef] = useForm<StepOneFormValue>();
    const {
        caseTree,
        expandedKeys
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);
    const [step, setStep] = useState(0);

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
        onOk();
    };

    /**
     * 下一步Click
     */
    const onNextClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onOk();
    };

    /**
     * 取消Click
     * @param event 
     */
    const onCancelClick = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
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
                disabled={step <= 1}
                type="primary"
                key="PWM_1">
                <ArrowLeftOutlined />
                <span>上一步</span>
            </Button>,
            <Button
                onClick={onNextClick}
                disabled={step >= 5}
                type="primary"
                key="PWM_2">
                <ArrowRightOutlined />
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
        <PaperworkModalBox>
            <div className="tree-box">
                <CaseTree
                    data={caseTree}
                    expandedKeys={expandedKeys}
                    onExpand={(keys) => dispatch({ type: 'paperworkModal/setExpandedKeys', payload: keys })}
                />
            </div>
            <div className="form-box">
                <StepForm
                    step={step}
                    oneFormRef={oneFormRef} />
            </div>
        </PaperworkModalBox>
    </Modal>
};

export { PaperworkModal };